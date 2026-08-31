package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const (
	formDataPath = "../public/form-data.json"
	templatePath = "../public/template.json"
	imagesPath   = "../public/images"
)

type TemplatesFile struct {
	Templates []map[string]interface{} `json:"templates"`
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func readJSONFile(path string, target interface{}) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	return json.NewDecoder(file).Decode(target)
}

func writeJSONFile(path string, data interface{}) error {
	content, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, append(content, '\n'), 0644)
}

func writeJSONResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func formDataHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		var data map[string]interface{}

		if err := readJSONFile(formDataPath, &data); err != nil {
			http.Error(w, "No se pudo leer form-data.json", http.StatusInternalServerError)
			return
		}

		writeJSONResponse(w, data)

	case http.MethodPut:
		var data map[string]interface{}

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "JSON invalido", http.StatusBadRequest)
			return
		}

		if err := writeJSONFile(formDataPath, data); err != nil {
			http.Error(w, "No se pudo guardar form-data.json", http.StatusInternalServerError)
			return
		}

		writeJSONResponse(w, data)

	default:
		http.Error(w, "Metodo no permitido", http.StatusMethodNotAllowed)
	}
}

func templatesHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		var data TemplatesFile

		if err := readJSONFile(templatePath, &data); err != nil {
			http.Error(w, "No se pudo leer template.json", http.StatusInternalServerError)
			return
		}

		writeJSONResponse(w, data)

	case http.MethodPost:
		var newTemplate map[string]interface{}

		if err := json.NewDecoder(r.Body).Decode(&newTemplate); err != nil {
			http.Error(w, "Template invalido", http.StatusBadRequest)
			return
		}

		var data TemplatesFile
		if err := readJSONFile(templatePath, &data); err != nil {
			http.Error(w, "No se pudo leer template.json", http.StatusInternalServerError)
			return
		}
		templateName, ok := newTemplate["templateName"].(string)
		if !ok || templateName == "" {
			http.Error(w, "El template necesita un nombre", http.StatusBadRequest)
			return
		}

		for _, template := range data.Templates {
			if template["templateName"] == templateName {
				http.Error(w, "Ya existe un template con ese nombre", http.StatusConflict)
				return
			}
		}

		data.Templates = append(data.Templates, newTemplate)

		if err := writeJSONFile(templatePath, data); err != nil {
			http.Error(w, "No se pudo guardar template.json", http.StatusInternalServerError)
			return
		}

		writeJSONResponse(w, newTemplate)

	case http.MethodPut:
		var update struct {
			TemplateName string                 `json:"templateName"`
			Data         map[string]interface{} `json:"data"`
		}

		if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
			http.Error(w, "Datos invalidos", http.StatusBadRequest)
			return
		}

		if update.TemplateName == "" {
			http.Error(w, "Falta templateName", http.StatusBadRequest)
			return
		}

		var templatesFile TemplatesFile
		if err := readJSONFile(templatePath, &templatesFile); err != nil {
			http.Error(w, "No se pudo leer template.json", http.StatusInternalServerError)
			return
		}

		found := false

		for index, template := range templatesFile.Templates {
			if template["templateName"] == update.TemplateName {
				updatedTemplate := make(map[string]interface{})

				for key, value := range template {
					updatedTemplate[key] = value
				}

				for key, value := range update.Data {
					updatedTemplate[key] = value
				}

				updatedTemplate["templateName"] = update.TemplateName
				templatesFile.Templates[index] = updatedTemplate
				found = true
				break
			}
		}

		if !found {
			http.Error(w, "Template no encontrado", http.StatusNotFound)
			return
		}

		if err := writeJSONFile(templatePath, templatesFile); err != nil {
			http.Error(w, "No se pudo actualizar template.json", http.StatusInternalServerError)
			return
		}

		writeJSONResponse(w, templatesFile)

	default:
		http.Error(w, "Metodo no permitido", http.StatusMethodNotAllowed)
	}
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Metodo no permitido", http.StatusMethodNotAllowed)
		return
	}

	const maxImageSize = 5 << 20
	r.Body = http.MaxBytesReader(w, r.Body, maxImageSize)

	if err := r.ParseMultipartForm(maxImageSize); err != nil {
		http.Error(w, "La imagen supera el limite de 5 MB", http.StatusRequestEntityTooLarge)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Debe enviarse un archivo con el campo file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	extension := strings.ToLower(filepath.Ext(header.Filename))
	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !allowedExtensions[extension] {
		http.Error(w, "Formato no permitido", http.StatusBadRequest)
		return
	}

	buffer := make([]byte, 512)
	bytesRead, err := file.Read(buffer)
	if err != nil {
		http.Error(w, "No se pudo leer la imagen", http.StatusBadRequest)
		return
	}

	contentType := http.DetectContentType(buffer[:bytesRead])
	allowedContentTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/webp": true,
	}

	if !allowedContentTypes[contentType] {
		http.Error(w, "El archivo no es una imagen valida", http.StatusBadRequest)
		return
	}

	if _, err := file.Seek(0, io.SeekStart); err != nil {
		http.Error(w, "No se pudo procesar la imagen", http.StatusInternalServerError)
		return
	}

	randomBytes := make([]byte, 8)
	if _, err := rand.Read(randomBytes); err != nil {
		http.Error(w, "No se pudo generar el nombre", http.StatusInternalServerError)
		return
	}

	fileName := fmt.Sprintf(
		"%s-%s%s",
		"image",
		hex.EncodeToString(randomBytes),
		extension,
	)

	filePath := filepath.Join(imagesPath, fileName)

	destination, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "No se pudo guardar la imagen", http.StatusInternalServerError)
		return
	}
	defer destination.Close()

	if _, err := io.Copy(destination, file); err != nil {
		http.Error(w, "No se pudo guardar la imagen", http.StatusInternalServerError)
		return
	}

	writeJSONResponse(w, map[string]string{
		"fileName": fileName,
		"path":     "/images/" + fileName,
	})
}

func imagesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Metodo no permitido", http.StatusMethodNotAllowed)
		return
	}

	entries, err := os.ReadDir(imagesPath)
	if err != nil {
		http.Error(w, "No se pudo leer la carpeta de imagenes", http.StatusInternalServerError)
		return
	}

	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	images := make([]string, 0)

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		extension := strings.ToLower(filepath.Ext(entry.Name()))

		if allowedExtensions[extension] {
			images = append(images, entry.Name())
		}
	}

	writeJSONResponse(w, images)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	writeJSONResponse(w, map[string]string{
		"status": "ok",
	})
}

func main() {
	if _, err := os.Stat(formDataPath); err != nil {
		log.Fatal("No se encontro public/form-data.json")
	}

	if _, err := os.Stat(templatePath); err != nil {
		log.Fatal("No se encontro public/template.json")
	}

	if err := os.MkdirAll(imagesPath, 0755); err != nil {
		log.Fatal("No se pudo acceder a public/images")
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", healthHandler)
	mux.HandleFunc("/api/form-data", formDataHandler)
	mux.HandleFunc("/api/templates", templatesHandler)
	mux.HandleFunc("/api/uploads", uploadHandler)
	mux.HandleFunc("/api/images", imagesHandler)

	mux.Handle(
		"/images/",
		http.StripPrefix("/images/", http.FileServer(http.Dir(imagesPath))),
	)

	server := &http.Server{
		Addr:    ":8080",
		Handler: enableCORS(mux),
	}

	log.Println("Backend ejecutandose en http://localhost:8080")
	log.Fatal(server.ListenAndServe())
}
