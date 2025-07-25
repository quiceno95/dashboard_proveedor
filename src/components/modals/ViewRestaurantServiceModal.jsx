import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  CheckCircle, 
  XCircle,
  ChefHat,
  Utensils,
  Coffee,
  Car,
  Shield,
  Heart,
  Phone,
  Zap,
  Activity,
  Music,
  Wine,
  Gift,
  Clock,
  Accessibility
} from 'lucide-react';

const ViewRestaurantServiceModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  // Parsear detalles del servicio de restaurante
  const parsearDetallesRestaurante = (detallesString) => {
    try {
      return JSON.parse(detallesString);
    } catch (error) {
      console.error('Error al parsear detalles del restaurante:', error);
      return {};
    }
  };

  const detalles = parsearDetallesRestaurante(service.detalles_del_servicio || '{}');

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
              <ChefHat className="h-6 w-6 text-primary" />
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

          {/* Detalles del restaurante */}
          {detalles && Object.keys(detalles).length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Detalles del Restaurante</h3>
              
              {/* Información básica del restaurante */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {detalles.tipo_establecimiento && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-orange-600 font-medium">Tipo de Establecimiento</p>
                    </div>
                    <p className="text-orange-900 font-semibold">{detalles.tipo_establecimiento}</p>
                  </div>
                )}
                
                {detalles.estilo_gastronomico && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Utensils className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-600 font-medium">Estilo Gastronómico</p>
                    </div>
                    <p className="text-green-900 font-semibold">{detalles.estilo_gastronomico}</p>
                  </div>
                )}
                
                {detalles.capacidad && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <p className="text-sm text-purple-600 font-medium">Capacidad</p>
                    </div>
                    <p className="text-purple-900 font-semibold">{detalles.capacidad} comensales</p>
                  </div>
                )}
              </div>

              {/* Servicios */}
              {detalles.servicios && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Servicios</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(detalles.servicios).map(([key, value]) => (
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

              {/* Horarios */}
              {detalles.horarios && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Horarios</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(detalles.horarios).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${value ? 'text-green-700' : 'text-red-700'}`}>
                          {key === 'veinticuatro_horas' ? '24 horas' : 
                           key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {detalles.extras && Object.values(detalles.extras).some(value => value) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Music className="h-4 w-4 text-primary" />
                    <span>Extras</span>
                  </h4>
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

              {/* Promociones */}
              {detalles.promociones && Object.values(detalles.promociones).some(value => value) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-primary" />
                    <span>Promociones</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(detalles.promociones).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-700">
                            {key === 'happy_hour' ? 'Happy Hour' :
                             key === 'descuentos_por_grupo' ? 'Descuentos por Grupo' :
                             key === 'menu' ? 'Menú Especial' :
                             key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Servicios adicionales */}
              {detalles.servicios_adicionales && Object.values(detalles.servicios_adicionales).some(value => value) && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Servicios Adicionales</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(detalles.servicios_adicionales).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex items-center space-x-2">
                          {key === 'parqueadero' && <Car className="h-4 w-4 text-purple-500" />}
                          {key === 'pet_friendly' && <Heart className="h-4 w-4 text-purple-500" />}
                          {key === 'room_service' && <Phone className="h-4 w-4 text-purple-500" />}
                          {key === 'ascensor' && <Activity className="h-4 w-4 text-purple-500" />}
                          {key === 'planta_energia' && <Zap className="h-4 w-4 text-purple-500" />}
                          {key === 'rampa_discapacitados' && <Accessibility className="h-4 w-4 text-purple-500" />}
                          {!['parqueadero', 'pet_friendly', 'room_service', 'ascensor', 'planta_energia', 'rampa_discapacitados'].includes(key) && 
                           <CheckCircle className="h-4 w-4 text-purple-500" />}
                          <span className="text-sm text-purple-700">
                            {key === 'pet_friendly' ? 'Pet Friendly' :
                             key === 'room_service' ? 'Room Service' :
                             key === 'planta_energia' ? 'Planta Eléctrica' :
                             key === 'rampa_discapacitados' ? 'Rampa Discapacitados' :
                             key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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

export default ViewRestaurantServiceModal;
