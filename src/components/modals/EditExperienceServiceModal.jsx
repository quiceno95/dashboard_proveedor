import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  DollarSign, 
  FileText, 
  Star,
  Mountain,
  Clock,
  Users,
  Shield,
  Calendar,
  Globe,
  Camera,
  Car,
  Heart,
  UserCheck,
  Backpack,
  Navigation
} from 'lucide-react';
import servicesService from '../../services/servicesService';
import Swal from 'sweetalert2';

const EditExperienceServiceModal = ({ isOpen, onClose, service, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    descripcion: '',
    precio: '',
    moneda: 'COP',
    ciudad: '',
    departamento: '',
    ubicacion: '',
    relevancia: 'MEDIA',
    activo: true,
    
    // Detalles específicos de experiencias
    tipo_tour: '',
    duracion: '',
    grupo_objetivo: '',
    incluye: {
      transporte: false,
      guia: false,
      alimentacion: false,
      entradas_sitios: false
    },
    dificultad: '',
    disponibilidad: {
      fechas: '',
      horarios: ''
    },
    idiomas: {
      espanol: false,
      ingles: false,
      otros: ''
    },
    extras: {
      fotografias_profesionales: false,
      seguros_viaje: false
    },
    parqueadero: false,
    pet_friendly: false,
    grupo_maximo: '',
    equipamiento_requerido: '',
    punto_de_encuentro: ''
  });

  // Cargar datos del servicio cuando se abre el modal
  useEffect(() => {
    if (isOpen && service) {
      try {
        // Parsear detalles del servicio
        const detalles = service.detalles_del_servicio ? 
          JSON.parse(service.detalles_del_servicio) : {};

        setFormData({
          // Información básica
          nombre: service.nombre || '',
          descripcion: service.descripcion || '',
          precio: service.precio?.toString() || '',
          moneda: service.moneda || 'COP',
          ciudad: service.ciudad || '',
          departamento: service.departamento || '',
          ubicacion: service.ubicacion || '',
          relevancia: service.relevancia || 'MEDIA',
          activo: service.activo !== undefined ? service.activo : true,
          
          // Detalles específicos de experiencias
          tipo_tour: detalles.tipo_tour || '',
          duracion: detalles.duracion || '',
          grupo_objetivo: detalles.grupo_objetivo || '',
          incluye: {
            transporte: detalles.incluye?.transporte || false,
            guia: detalles.incluye?.guia || false,
            alimentacion: detalles.incluye?.alimentacion || false,
            entradas_sitios: detalles.incluye?.entradas_sitios || false
          },
          dificultad: detalles.dificultad || '',
          disponibilidad: {
            fechas: detalles.disponibilidad?.fechas || '',
            horarios: detalles.disponibilidad?.horarios || ''
          },
          idiomas: {
            espanol: detalles.idiomas?.espanol || false,
            ingles: detalles.idiomas?.ingles || false,
            otros: detalles.idiomas?.otros || ''
          },
          extras: {
            fotografias_profesionales: detalles.extras?.fotografias_profesionales || false,
            seguros_viaje: detalles.extras?.seguros_viaje || false
          },
          parqueadero: detalles.parqueadero || false,
          pet_friendly: detalles.pet_friendly || false,
          grupo_maximo: detalles.grupo_maximo?.toString() || '',
          equipamiento_requerido: detalles.equipamiento_requerido || '',
          punto_de_encuentro: detalles.punto_de_encuentro || ''
        });
      } catch (error) {
        console.error('❌ Error al parsear detalles del servicio:', error);
      }
    }
  }, [isOpen, service]);

  if (!isOpen || !service) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos obligatorios',
        confirmButtonColor: '#263DBF'
      });
      return;
    }

    try {
      setLoading(true);

      // Construir el JSON de detalles del servicio
      const detallesDelServicio = {
        tipo_tour: formData.tipo_tour,
        duracion: formData.duracion,
        grupo_objetivo: formData.grupo_objetivo,
        incluye: formData.incluye,
        dificultad: formData.dificultad,
        disponibilidad: formData.disponibilidad,
        idiomas: formData.idiomas,
        extras: formData.extras,
        parqueadero: formData.parqueadero,
        pet_friendly: formData.pet_friendly,
        grupo_maximo: parseInt(formData.grupo_maximo) || 0,
        equipamiento_requerido: formData.equipamiento_requerido,
        punto_de_encuentro: formData.punto_de_encuentro
      };

      // Preparar datos para enviar a la API
      const serviceData = {
        id_servicio: service.id_servicio,
        proveedor_id: service.proveedor_id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tipo_servicio: 'experiencias',
        precio: parseInt(formData.precio),
        moneda: formData.moneda,
        activo: formData.activo,
        fecha_creacion: service.fecha_creacion,
        fecha_actualizacion: new Date().toISOString(),
        relevancia: formData.relevancia,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        ubicacion: formData.ubicacion,
        detalles_del_servicio: JSON.stringify(detallesDelServicio)
      };

      console.log('📤 Actualizando experiencia:', serviceData);

      await servicesService.actualizarServicio(service.id_servicio, serviceData);
      
      Swal.fire({
        icon: 'success',
        title: 'Experiencia actualizada',
        text: 'La experiencia ha sido actualizada exitosamente',
        confirmButtonColor: '#263DBF'
      });
      
      onSuccess();
    } catch (error) {
      console.error('❌ Error al actualizar experiencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar experiencia',
        text: error.response?.data?.message || 'Ocurrió un error inesperado',
        confirmButtonColor: '#263DBF'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <Mountain className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Editar Experiencia</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Información Básica</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mountain className="h-4 w-4 inline mr-1" />
                  Nombre de la Experiencia *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Ej: Tour Gastronómico por el Centro Histórico"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Precio *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="input flex-1"
                    placeholder="150000"
                    required
                  />
                  <select
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    className="input w-20"
                  >
                    <option value="COP">COP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="h-4 w-4 inline mr-1" />
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="input w-full"
                placeholder="Describe la experiencia que ofreces..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Bogotá"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Departamento *
                </label>
                <input
                  type="text"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Cundinamarca"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Star className="h-4 w-4 inline mr-1" />
                  Relevancia
                </label>
                <select
                  name="relevancia"
                  value={formData.relevancia}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Navigation className="h-4 w-4 inline mr-1" />
                Ubicación Específica
              </label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Calle 100 # 15-20"
              />
            </div>
          </div>

          {/* Detalles de la experiencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Mountain className="h-5 w-5 text-primary" />
              <span>Detalles de la Experiencia</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mountain className="h-4 w-4 inline mr-1" />
                  Tipo de Tour
                </label>
                <select
                  name="tipo_tour"
                  value={formData.tipo_tour}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Ecológico">Ecológico</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Gastronómico">Gastronómico</option>
                  <option value="Histórico">Histórico</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duración
                </label>
                <select
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="">Seleccionar duración</option>
                  <option value="Medio día">Medio día</option>
                  <option value="Día completo">Día completo</option>
                  <option value="Varios días">Varios días</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="h-4 w-4 inline mr-1" />
                  Grupo Objetivo
                </label>
                <select
                  name="grupo_objetivo"
                  value={formData.grupo_objetivo}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="">Seleccionar grupo</option>
                  <option value="Individual">Individual</option>
                  <option value="Pareja">Pareja</option>
                  <option value="Familiar">Familiar</option>
                  <option value="Corporativo">Corporativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Shield className="h-4 w-4 inline mr-1" />
                Dificultad
              </label>
              <select
                name="dificultad"
                value={formData.dificultad}
                onChange={handleInputChange}
                className="input w-full md:w-1/3"
              >
                <option value="">Seleccionar dificultad</option>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          {/* Incluye */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>¿Qué Incluye?</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="incluye.transporte"
                  checked={formData.incluye.transporte}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Transporte</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="incluye.guia"
                  checked={formData.incluye.guia}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Guía</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="incluye.alimentacion"
                  checked={formData.incluye.alimentacion}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Alimentación</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="incluye.entradas_sitios"
                  checked={formData.incluye.entradas_sitios}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Entradas a sitios</span>
              </label>
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Disponibilidad</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fechas Disponibles
                </label>
                <input
                  type="text"
                  name="disponibilidad.fechas"
                  value={formData.disponibilidad.fechas}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Ej: Lunes a Viernes, Fines de semana"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Horarios
                </label>
                <input
                  type="text"
                  name="disponibilidad.horarios"
                  value={formData.disponibilidad.horarios}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Ej: 8:00 AM - 6:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Idiomas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Idiomas</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="idiomas.espanol"
                  checked={formData.idiomas.espanol}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Español</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="idiomas.ingles"
                  checked={formData.idiomas.ingles}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Inglés</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Otros Idiomas
                </label>
                <input
                  type="text"
                  name="idiomas.otros"
                  value={formData.idiomas.otros}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Francés, Alemán, etc."
                />
              </div>
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Extras</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="extras.fotografias_profesionales"
                  checked={formData.extras.fotografias_profesionales}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Fotografías profesionales</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="extras.seguros_viaje"
                  checked={formData.extras.seguros_viaje}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Seguros de viaje</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="parqueadero"
                  checked={formData.parqueadero}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Parqueadero</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pet_friendly"
                  checked={formData.pet_friendly}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Pet Friendly</span>
              </label>
            </div>
          </div>

          {/* Información adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>Información Adicional</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="h-4 w-4 inline mr-1" />
                  Grupo Máximo
                </label>
                <input
                  type="number"
                  name="grupo_maximo"
                  value={formData.grupo_maximo}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Navigation className="h-4 w-4 inline mr-1" />
                  Punto de Encuentro
                </label>
                <input
                  type="text"
                  name="punto_de_encuentro"
                  value={formData.punto_de_encuentro}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Plaza de Bolívar"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Backpack className="h-4 w-4 inline mr-1" />
                Equipamiento Requerido
              </label>
              <textarea
                name="equipamiento_requerido"
                value={formData.equipamiento_requerido}
                onChange={handleInputChange}
                rows={2}
                className="input w-full"
                placeholder="Ropa cómoda, zapatos deportivos, protector solar..."
              />
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium text-gray-700">
              Experiencia activa (visible para los clientes)
            </label>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Actualizando...' : 'Actualizar Experiencia'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExperienceServiceModal;
