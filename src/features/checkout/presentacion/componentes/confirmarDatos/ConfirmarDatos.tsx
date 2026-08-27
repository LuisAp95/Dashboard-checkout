import { useAppContext } from '../../../../../context/AppContext'
import { useDivisePreview } from '../../../../../context/device-preview-context';

interface SuccessModalProps {
    onClose?: () => void
}

interface DataItem {
    label: string;
    value: string | number;
}

export default function ConfirmarDatos({ onClose }: SuccessModalProps) {
    const { states } = useAppContext();
    const {deviceType} = useDivisePreview();

    // Datos del cobrador
    const cobradorData: DataItem[] = [
        { label: 'Nombre', value: 'Seguros Horizonte S.A' },
        { label: 'Nro Documento', value: 'G200087013' },
        { label: 'Concepto', value: 'Pago de poliza' },
        { label: 'Monto', value: '1.000,25' }
    ]

    // Datos del pagador
    const pagadorData: DataItem[] = [
        { label: 'Banco', value: '0105 - Mercantil' },
        { label: 'Nro Documento', value: 'V1253' },
        { label: 'Telefono', value: '424 1882255' }
    ]

    // Componente reutilizable para mostrar filas de datos
    const DataRow = ({ label, value }: DataItem) => (
        <div className="flex w-full justify-center">
            <div className='flex w-1/2'>
                <p>{label}:</p>
            </div>
            <div className='flex w-1/2'>
                <label 
                style={{color: states.selecteTemplate === '1' ? states.textModalColorInfo : states.textColorConInfo}}
                className="text-blue-500 overflow-hidden text-ellipsis font-medium text-sm md:text-md">
                    {typeof value === 'string' && value.length > 30 
                        ? <span className="whitespace-nowrap ">{value}</span>
                        : value}
                </label>
            </div>
        </div>
    )

    return (
        <div className={`flex flex-col px-2 w-full gap-4 items-center justify-center h-full ${deviceType === "desktop"&& 'md:px-6 md:h-auto' }`} >
            {/* Sección Cobrador */}
            <div className="flex flex-col gap-y-4 w-full">
                <h1 className="text-xl">Datos del Cobrador</h1>
                <div className="flex flex-col gap-2">
                    {cobradorData.map((item, index) => (
                        <DataRow key={`cobrador-${index}`} {...item} />
                    ))}
                </div>
            </div>

            {/* Sección Pagador */}
            <div className="flex flex-col  gap-y-4 w-full">
                <h1 className="text-xl">Datos del Pagador</h1>
                <div className="flex flex-col gap-2">
                    {pagadorData.map((item, index) => (
                        <DataRow key={`pagador-${index}`} {...item} />
                    ))}
                </div>
            </div>

            {/* Botón OK (condicional) */}
            {states.selecteTemplate !== '2' && (
                <button style={{backgroundColor: states.bgButtonColorForm,
                    color: states.textColorBotonForm
                }}
                    onClick={onClose}
                    className="text-center p-2 mb-5 cursor-pointer text-sm rounded-2xl uppercase w-[100px] h-[40px] font-light hover:bg-blue-700 transition-colors"
                >
                    OK
                </button>
            )}
        </div>
    )
}

