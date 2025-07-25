import React from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Star, CheckCircle, XCircle } from 'lucide-react';
import servicesService from '../../services/servicesService';

const ViewServiceModal = ({ isOpen, onClose, service }) => {
  console.log('👁️ ViewServiceModal renderizado con:', { isOpen, service: !!service });
  
  if (!isOpen || !service) {
    console.log('👁️ ViewServiceModal no se muestra - isOpen:', isOpen, 'service:', !!service);
    return null;
  }
  
  console.log('👁️ ViewServiceModal se va a mostrar con servicio:', service.nombre);

  // Parsear detalles del servicio
  const detalles = servicesService.parsearDetallesServicio(service.detalles_del_servicio);

  const formatPrice = (price, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{service.nombre}</h2>
              <p className="text-sm text-gray-600">{service.tipo_servicio}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información General</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Precio</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(service.precio, service.moneda)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Ubicación</p>
                      <p className="font-semibold text-gray-900">
                        {service.ciudad}, {service.departamento}
                      </p>
                      {service.ubicacion && (
                        <p className="text-sm text-gray-600">{service.ubicacion}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Relevancia</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.relevancia === 'ALTA' ? 'bg-red-100 text-red-800' :
                        service.relevancia === 'MEDIA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {service.relevancia}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`h-5 w-5 rounded-full ${service.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className="font-semibold text-gray-900">
                        {service.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fechas</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha de creación</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(service.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Última actualización</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(service.fecha_actualizacion)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {service.descripcion}
            </p>
          </div>

          {/* Detalles del alojamiento */}
          {detalles && Object.keys(detalles).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalles del Alojamiento</h3>
              
              {/* Información básica del alojamiento */}
              {(detalles.tipo_alojamiento || detalles.habitacion || detalles.capacidad) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {detalles.tipo_alojamiento && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Tipo de Alojamiento</p>
                      <p className="text-blue-900 font-semibold">{detalles.tipo_alojamiento}</p>
                    </div>
                  )}
                  
                  {detalles.habitacion && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Tipo de Habitación</p>
                      <p className="text-green-900 font-semibold">{detalles.habitacion}</p>
                    </div>
                  )}
                  
                  {detalles.capacidad && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <p className="text-sm text-purple-600 font-medium">Capacidad</p>
                      </div>
                      <p className="text-purple-900 font-semibold">{detalles.capacidad} personas</p>
                    </div>
                  )}
                </div>
              )}

              {/* Servicios incluidos */}
              {detalles.servicios_incluidos && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Servicios Incluidos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(detalles.servicios_incluidos).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${value ? 'text-green-700' : 'text-red-700'}`}>
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Política de reservas */}
              {detalles.politica_reservas && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Política de Reservas</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {detalles.politica_reservas.check_in && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{detalles.politica_reservas.check_in}</span>
                      </div>
                    )}
                    {detalles.politica_reservas.check_out && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{detalles.politica_reservas.check_out}</span>
                      </div>
                    )}
                    {detalles.politica_reservas.cancelaciones && (
                      <div>
                        <span className="text-gray-600">Cancelaciones:</span>
                        <p className="text-sm text-gray-700 mt-1">{detalles.politica_reservas.cancelaciones}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Servicios extras */}
              {detalles.extras && Object.values(detalles.extras).some(value => value) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Servicios Extras</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(detalles.extras).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-blue-700">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
