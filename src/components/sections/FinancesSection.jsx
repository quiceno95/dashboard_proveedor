import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CreditCard, 
  Receipt, 
  PieChart,
  BarChart3,
  Download,
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const FinancesSection = ({ userType }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Datos financieros de ejemplo según el tipo de usuario
  const getFinancialData = () => {
    const baseData = {
      totalRevenue: 15750000,
      monthlyGrowth: 12.5,
      totalTransactions: 342,
      averageTicket: 46053,
      expenses: 8420000,
      netProfit: 7330000,
      profitMargin: 46.5
    };

    const transactions = [
      {
        id: 1,
        date: '2024-01-15',
        description: 'Reserva Suite Ejecutiva - Carlos Rodríguez',
        amount: 900000,
        type: 'income',
        method: 'credit_card',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-01-14',
        description: 'Pago servicios públicos',
        amount: -450000,
        type: 'expense',
        method: 'bank_transfer',
        status: 'completed'
      },
      {
        id: 3,
        date: '2024-01-14',
        description: 'Cena Romántica - Ana Martínez',
        amount: 120000,
        type: 'income',
        method: 'cash',
        status: 'completed'
      },
      {
        id: 4,
        date: '2024-01-13',
        description: 'Compra suministros cocina',
        amount: -280000,
        type: 'expense',
        method: 'credit_card',
        status: 'completed'
      },
      {
        id: 5,
        date: '2024-01-13',
        description: 'Tour Gastronómico - Fernando Castro',
        amount: 640000,
        type: 'income',
        method: 'bank_transfer',
        status: 'pending'
      }
    ];

    const monthlyData = [
      { month: 'Ene', income: 12500000, expenses: 7200000 },
      { month: 'Feb', income: 14200000, expenses: 8100000 },
      { month: 'Mar', income: 15800000, expenses: 8900000 },
      { month: 'Abr', income: 13900000, expenses: 7800000 },
      { month: 'May', income: 16200000, expenses: 9200000 },
      { month: 'Jun', income: 15750000, expenses: 8420000 }
    ];

    // Adaptar descripciones según el tipo de usuario
    const adaptedTransactions = transactions.map(transaction => {
      if (userType === 'restaurante') {
        return {
          ...transaction,
          description: transaction.description
            .replace(/Suite|Habitación/gi, 'Mesa')
            .replace(/Tour/gi, 'Menú')
            .replace(/Reserva/gi, 'Pedido')
        };
      } else if (userType === 'tour') {
        return {
          ...transaction,
          description: transaction.description
            .replace(/Suite|Habitación/gi, 'Tour')
            .replace(/Cena/gi, 'Experiencia')
            .replace(/Reserva/gi, 'Booking')
        };
      }
      return transaction;
    });

    return {
      ...baseData,
      transactions: adaptedTransactions,
      monthlyData
    };
  };

  const financialData = getFinancialData();

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Receipt className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'bank_transfer':
        return 'Transferencia';
      case 'cash':
        return 'Efectivo';
      default:
        return 'Otro';
    }
  };

  const getStatusBadge = (status) => {
    return status === 'completed' ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
        Completado
      </span>
    ) : (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        Pendiente
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    return `${isNegative ? '-' : ''}$${absAmount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión Financiera</h2>
          <p className="text-sm text-gray-600">
            Monitorea ingresos, gastos y rentabilidad
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="input-field w-auto"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +{financialData.monthlyGrowth}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">
              ${financialData.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-gray-500 text-sm">
              {financialData.totalTransactions} transacciones
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900">
              ${financialData.averageTicket.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-gray-500 text-sm">
              {((financialData.expenses / financialData.totalRevenue) * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
            <p className="text-2xl font-bold text-gray-900">
              ${financialData.expenses.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium">
              {financialData.profitMargin}% margen
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ganancia Neta</p>
            <p className="text-2xl font-bold text-gray-900">
              ${financialData.netProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de ingresos vs gastos */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Ingresos vs Gastos</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Ingresos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Gastos</span>
            </div>
          </div>
        </div>
        
        {/* Simulación de gráfico con barras */}
        <div className="space-y-4">
          {financialData.monthlyData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-sm text-gray-600">{data.month}</div>
              <div className="flex-1 flex space-x-2">
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.income / 20000000) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    ${(data.income / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.expenses / 20000000) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    ${(data.expenses / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transacciones recientes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Transacciones Recientes</h3>
          <button className="text-primary hover:text-secondary text-sm font-medium">
            Ver todas
          </button>
        </div>

        <div className="space-y-4">
          {financialData.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {getPaymentMethodIcon(transaction.method)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{formatDate(transaction.date)}</span>
                    <span>{getPaymentMethodName(transaction.method)}</span>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(transaction.amount)}
                </p>
                <button className="text-gray-400 hover:text-gray-600 mt-1">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por método de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Métodos de Pago</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Tarjeta de Crédito</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$8,450,000</p>
                <p className="text-xs text-gray-500">53.7%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Transferencia</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$5,200,000</p>
                <p className="text-xs text-gray-500">33.0%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Efectivo</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">$2,100,000</p>
                <p className="text-xs text-gray-500">13.3%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Objetivos del Mes</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Ingresos</span>
                <span className="font-medium">$15.7M / $18M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Margen de Ganancia</span>
                <span className="font-medium">46.5% / 50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Transacciones</span>
                <span className="font-medium">342 / 400</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancesSection;
