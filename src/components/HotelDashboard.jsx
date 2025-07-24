import React, { useState, useEffect } from 'react';
import { Building, LogOut, Settings, Users, Calendar } from 'lucide-react';
import authService from '../services/authService';
import Swal from 'sweetalert2';

const HotelDashboard = ({ user, onLogout }) => {
  const [hotelData, setHotelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      setIsLoading(true);
      try {
        const result = await authService.getUserData(user.id, 'hotel');
        
        if (result.success) {
          setHotelData(result.data);
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error al cargar datos',
            text: result.error,
            confirmButtonColor: '#263DBF'
          });
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'No se pudieron cargar los datos del hotel',
          confirmButtonColor: '#263DBF'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelData();
  }, [user.id]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#263DBF',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      authService.logout();
      onLogout();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando información del hotel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Dashboard Hotel</h1>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información del Hotel */}
        {hotelData && (
          <div className="mb-8">
            <div className="card animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Información del Hotel</h2>
                <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Activo
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(hotelData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card animate-slide-up">
            <div className="flex items-center">
              <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Habitaciones</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-success bg-opacity-10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Huéspedes</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-warning bg-opacity-10 rounded-lg">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reservas</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-info bg-opacity-10 rounded-lg">
                <Settings className="h-6 w-6 text-info" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Servicios</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de construcción */}
        <div className="card text-center animate-fade-in">
          <div className="py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Building className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sitio en construcción
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Estamos trabajando en nuevas funcionalidades para tu dashboard de hotel. 
              Pronto podrás gestionar reservas, habitaciones y mucho más.
            </p>
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="animate-bounce-gentle mr-2">
                  🚧
                </div>
                <span className="text-sm font-medium text-yellow-800">
                  Funcionalidades en desarrollo
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelDashboard;
