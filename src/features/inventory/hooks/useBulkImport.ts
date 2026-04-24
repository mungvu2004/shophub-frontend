import { useState, useCallback } from 'react'
import type { BulkImportRow, BulkImportResult, BulkImportValidationError } from '@/features/inventory/logic/bulkImport.types'
import { toast } from 'sonner'

export function useBulkImport() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => {
    setIsOpen(false)
    setImportResult(null)
    setFile(null)
  }, [])

  const validateData = useCallback((rows: BulkImportRow[]): BulkImportValidationError[] => {
    const errors: BulkImportValidationError[] = []
    
    rows.forEach((row, index) => {
      const rowIndex = index + 1
      
      if (!row.sku) {
        errors.push({ row: rowIndex, column: 'sku', message: 'Mã SKU không được để trống' })
      }
      
      if (isNaN(row.warehouseHN) || row.warehouseHN < 0) {
        errors.push({ row: rowIndex, column: 'warehouseHN', message: 'Tồn kho HN phải là số >= 0' })
      }
      
      if (isNaN(row.warehouseHCM) || row.warehouseHCM < 0) {
        errors.push({ row: rowIndex, column: 'warehouseHCM', message: 'Tồn kho HCM phải là số >= 0' })
      }
      
      if (isNaN(row.warehouseDN) || row.warehouseDN < 0) {
        errors.push({ row: rowIndex, column: 'warehouseDN', message: 'Tồn kho ĐN phải là số >= 0' })
      }
    })
    
    return errors
  }, [])

  const handleFileUpload = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setIsProcessing(true)
    
    try {
      // Giả lập đọc file CSV
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        // Bỏ qua header
        const rows: BulkImportRow[] = lines.slice(1).map(line => {
          const [sku, productName, hn, hcm, dn, reason, note] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
          return {
            sku,
            productName,
            warehouseHN: parseInt(hn) || 0,
            warehouseHCM: parseInt(hcm) || 0,
            warehouseDN: parseInt(dn) || 0,
            reason,
            note
          }
        })
        
        const errors = validateData(rows)
        
        setImportResult({
          successCount: rows.length - new Set(errors.map(e => e.row)).size,
          errorCount: new Set(errors.map(e => e.row)).size,
          errors,
          data: rows
        })
        setIsProcessing(false)
      }
      reader.readAsText(selectedFile)
    } catch (error) {
      console.error('Error reading file:', error)
      toast.error('Đã có lỗi xảy ra khi đọc file.')
      setIsProcessing(false)
    }
  }, [validateData])

  const handleConfirmImport = useCallback(async () => {
    if (!importResult || importResult.errorCount > 0) {
      toast.error('Vui lòng sửa hết lỗi trước khi xác nhận.')
      return
    }
    
    setIsProcessing(true)
    try {
      // Giả lập gửi request lên server
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Đã cập nhật tồn kho thành công cho ${importResult.successCount} SKU.`)
      closeModal()
    } catch (error) {
      console.error('Import failed:', error)
      toast.error('Cập nhật tồn kho thất bại.')
    } finally {
      setIsProcessing(false)
    }
  }, [importResult, closeModal])

  return {
    isOpen,
    isProcessing,
    importResult,
    file,
    openModal,
    closeModal,
    handleFileUpload,
    handleConfirmImport
  }
}
