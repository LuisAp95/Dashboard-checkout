import React, { useState, useRef, useEffect, memo, useCallback } from "react"
import { useAppContext } from "../../../../../context/AppContext"
import { useDivisePreview } from "../../../../../context/device-preview-context"
import { Utp } from "../../../../../assets/svg/Svg"

interface VerificationModalProps {
  onSuccess: () => void
}

const VerificationModal = memo(({ onSuccess }: VerificationModalProps) => {
  const [code, setCode] = useState<string[]>(Array(8).fill(""))
  const [timer, setTimer] = useState(30)
  const [canRequestNewToken, setCanRequestNewToken] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(8).fill(null))
  const { selecteTemplate, bgModalColor, bgButtonColorForm, textColorBotonForm, textModalColorInfo, textColorModal } = useAppContext().states
  const { deviceType } = useDivisePreview()

  const isCodeComplete = code.every((digit) => digit !== "")

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (timer > 0 && !canRequestNewToken) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setCanRequestNewToken(true)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer, canRequestNewToken])

  const handleChange = useCallback((index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    setCode(prev => {
      const newCode = [...prev]
      newCode[index] = value
      return newCode
    })

    // Auto-advance to next input
    if (value !== "" && index < 7 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [])

  // Handle key press for backspace
  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [code])

  // Handle paste functionality
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only proceed if pasted content is numeric
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.split("").slice(0, 8)

    setCode(prev => {
      const newCode = [...prev]
      digits.forEach((digit, index) => {
        if (index < 8) {
          newCode[index] = digit
        }
      })
      return newCode
    })

    // Focus on the appropriate input after paste
    if (digits.length < 8 && inputRefs.current[digits.length]) {
      inputRefs.current[digits.length]?.focus()
    }
  }, [])

  // Request new token
  const requestNewToken = useCallback(() => {
    setTimer(30)
    setCanRequestNewToken(false)
    setCode(Array(8).fill(""))
    inputRefs.current[0]?.focus()
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (isCodeComplete) {
      onSuccess()
    }
  }, [isCodeComplete, onSuccess])

  const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el
  }, [])

  return (
    <div
      style={{
        backgroundColor: selecteTemplate === "2" ? "transparent" : bgModalColor
      }}
      className="p-6 flex flex-col items-center rounded"
    >
      <div className="h-14 w-14 mx-auto">
        <Utp />
      </div>
      <div className="px-5 py-3">
        <h2 className="text-md  text-center">
          Ingrese la clave de pago <br />
          enviada a su cuenta de  <br /> correo electrónico o buzón de mensaje.
        </h2>
      </div>

      <div className="flex gap-2 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={setInputRef(index)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`w-8 h-10 border border-gray-300 rounded text-center text-lg font-medium
               focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ${deviceType === 'desktop' && 'md:w-10 md:h-12'}`}
          />
        ))}
      </div>

      {selecteTemplate === "2" ? (
        <>
          {canRequestNewToken ? (
            <button
              onClick={requestNewToken}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Solicitar nuevo token
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Espere antes de solicitar {timer} seg
            </p>
          )}

          <div className="flex justify-between w-full h-full pt-8 origin-bottom bottom-6 relativo">
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: isCodeComplete ? bgButtonColorForm : "#B2BEB5",
                color: textColorBotonForm
              }}
              disabled={!isCodeComplete}
              className={`absolute text-white px-6 py-2 rounded-full transition-colors bottom-5 right-5 z-10
                /*${isCodeComplete
                  ? "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
                }*/`}
            >
              Pagar
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={handleSubmit}
            disabled={!isCodeComplete}
            style={{
              backgroundColor: isCodeComplete ? bgButtonColorForm : "#B2BEB5",
              color: textColorBotonForm
            }}
            className={`w-full py-3 rounded-md text-white font-medium mb-4 
              ${isCodeComplete
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Confirmar
          </button>

          {canRequestNewToken ? (
            <button
              onClick={requestNewToken}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              style={{
                color: textModalColorInfo
              }}
            >
              Solicitar nuevo token
            </button>
          ) : (
            <p className=" text-sm"
            style={{color: textColorModal}}
            >
              Espere antes de solicitar {timer} seg
            </p>
          )}
        </>
      )}
    </div>
  )
})

VerificationModal.displayName = 'VerificationModal'

export default VerificationModal
