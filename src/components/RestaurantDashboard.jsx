import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import authService from '../services/authService';
import Swal from 'sweetalert2';
import DashboardNavigation from './DashboardNavigation';
import ServicesSection from './sections/ServicesSection';
import ReservationsSection from './sections/ReservationsSection';
import ClientsSection from './sections/ClientsSection';
import FinancesSection from './sections/FinancesSection';
import StatisticsSection from './sections/StatisticsSection';

const RestaurantDashboard = ({ user, onLogout }) => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('servicios');

  useEffect(() => {
    const fetchRestaurantData = async () => {
      setIsLoading(true);
      try {
        const result = await authService.getUserData(user.id, 'restaurante');
        
        if (result.success) {
          setRestaurantData(result.data);
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
          text: 'No se pudieron cargar los datos del restaurante',
          confirmButtonColor: '#263DBF'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
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
    };
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'servicios':
        return <ServicesSection userType="restaurante" />;
      case 'reservas':
        return <ReservationsSection userType="restaurante" />;
      case 'clientes':
        return <ClientsSection userType="restaurante" />;
      case 'finanzas':
        return <FinancesSection userType="restaurante" />;
      case 'estadisticas':
        return <StatisticsSection userType="restaurante" />;
      default:
        return <ServicesSection userType="restaurante" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando información del restaurante...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con información del usuario */}
      <header className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-auto"
                src="/logo-vertical-color.png"
                alt="Logo"
              />
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-600">Usuario: {user.tipo_usuario}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navegación del dashboard */}
      <DashboardNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userType="restaurante"
      />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
};

export default RestaurantDashboard;
