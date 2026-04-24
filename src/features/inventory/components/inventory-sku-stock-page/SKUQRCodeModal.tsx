import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Printer, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export type SKUQRCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sku: string;
  productName: string;
};

export function SKUQRCodeModal({ isOpen, onClose, sku, productName }: SKUQRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sku);
    setCopied(true);
    toast.success('Đã sao chép mã SKU');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
    toast.info('Đang chuẩn bị bản in...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
        <div className="relative isolate px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.08),_transparent_40%)]" />
          
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-slate-900">Mã QR SKU</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Sử dụng mã này để quét khi nhập/xuất kho nhanh.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative group p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
              {/* QR Code Placeholder - In production, use a library like qrcode.react */}
              <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-indigo-200 transition-colors">
                <QrCode className="w-24 h-24 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase shadow-lg">
                Verified SKU
              </div>
            </div>

            <div className="w-full space-y-2 text-center">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{productName}</h3>
              <div className="flex items-center justify-center gap-2">
                <code className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-indigo-600 font-mono text-sm font-bold">
                  {sku}
                </code>
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10 gap-3 sm:justify-center">
            <Button 
              variant="outline" 
              className="rounded-full border-slate-200 bg-white font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex-1"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              In mã vạch
            </Button>
            <Button 
              className="rounded-full bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Tải về
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
