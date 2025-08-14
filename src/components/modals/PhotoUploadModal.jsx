import React, { useState } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon, UploadCloud } from 'lucide-react';
import photosService from '../../services/photosService';

// Base del bucket S3 (solo para construir URL destino cuando se elige archivo)
const S3_BASE = 'https://bucket-foto-reservat-qa.s3.us-east-1.amazonaws.com/img';

const PhotoUploadModal = ({ isOpen, onClose, serviceId, onCreated }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState(0);
  const [esPortada, setEsPortada] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setFile(null);
    setUrl('');
    setDescripcion('');
    setOrden(0);
    setEsPortada(false);
    setMessage('');
  };

  // Utilidades para construir una URL determinística
  const slugify = (str) => {
    return String(str)
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const computeS3Url = (f = file) => {
    if (!f || !serviceId) return '';
    const original = f.name || 'image';
    const hasExt = /\.[^/.]+$/.test(original);
    const base = hasExt ? original.replace(/\.[^/.]+$/, '') : original;
    const ext = hasExt ? original.split('.').pop() : 'jpg';
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${ts}-${slugify(base)}.${ext}`;
    return `${S3_BASE}/${serviceId}/${fileName}`;
  };

  // Modo URL-only: no intentamos subir al bucket desde el front para evitar errores de CORS/permisos.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceId) return;
    setSubmitting(true);
    setMessage('');

    try {
      const finalUrl = (url || '').trim();
      if (!finalUrl) {
        setMessage('Por favor selecciona un archivo o ingresa una URL.');
        setSubmitting(false);
        return;
      }

      setMessage('Registrando foto en el servicio...');
      await photosService.crearFoto({
        servicio_id: serviceId,
        url: finalUrl,
        descripcion,
        orden: Number(orden) || 0,
        es_portada: !!esPortada,
        eliminado: false,
      });

      setMessage('¡Foto creada exitosamente!');
      if (typeof onCreated === 'function') onCreated();
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error al crear la foto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Agregar fotos del servicio</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Aviso de modo URL-only */}
          <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
            Por ahora la app no sube el archivo al bucket. Se <strong>genera la URL destino</strong> y se registra en la API.
            Asegúrate de subir el archivo al bucket o compárteme un <strong>endpoint de URL prefirmada</strong> para automatizar la carga.
          </div>
          {/* Cargar archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo (opcional)</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    if (f && serviceId) {
                      const autoUrl = computeS3Url(f);
                      setUrl(autoUrl);
                      setMessage('URL generada automáticamente para el bucket.');
                    }
                  }}
                  className="block w-full text-sm text-gray-700"
                />
              </div>
              <UploadCloud className="h-5 w-5 text-gray-400" />
            </div>
            {file && (
              <p className="mt-1 text-xs text-gray-500">Destino sugerido en bucket: {computeS3Url()}</p>
            )}
          </div>

          {/* O URL directa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL (opcional)</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Si ya subiste la imagen al bucket, pega la URL aquí.</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="input-field"
                placeholder="Descripción de la imagen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="input-field"
                min={0}
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="es_portada"
                type="checkbox"
                checked={esPortada}
                onChange={(e) => setEsPortada(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="es_portada" className="text-sm text-gray-700">Usar como portada</label>
            </div>
          </div>

          {message && (
            <div className="text-sm text-gray-600">{message}</div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {submitting ? 'Guardando...' : 'Guardar foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
