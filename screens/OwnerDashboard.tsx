import React, { useState, useMemo } from 'react';
import { Appointment, AppointmentStatus, Employee, Expense, PetSize, Service } from '../types';
import { ArrowLeftIcon, CalendarIcon, ChartBarIcon, CogIcon, PawIcon, TagIcon, TruckIcon, UsersIcon } from '../components/icons';

interface OwnerDashboardProps {
  onLogout: () => void;
}

// MOCK DATA for Owner
const MOCK_SERVICES_OWNER: Service[] = [
  { id: '1', name: 'Banho', description: 'Banho completo com produtos hipoalergênicos.', prices: { Pequeno: 30, Médio: 40, Grande: 50 } },
  { id: '2', name: 'Tosa Higiênica', description: 'Tosa das áreas íntimas, patas e barriga.', prices: { Pequeno: 25, Médio: 30, Grande: 35 } },
  { id: '3', name: 'Banho e Tosa', description: 'Pacote completo de embelezamento.', prices: { Pequeno: 60, Médio: 75, Grande: 90 } },
];

const MOCK_EMPLOYEES_OWNER: Employee[] = [
  { id: '1', name: 'Juliana Silva', position: 'Banhista & Tosadora', workingHours: 'Ter - Sáb, 09:00 - 18:00' },
  { id: '2', name: 'Ricardo Mendes', position: 'Banhista', workingHours: 'Seg - Sex, 08:00 - 17:00' },
];

const MOCK_APPOINTMENTS_OWNER: Appointment[] = [
  { id: 'a1', clientId: 'c1', petId: 'p1', serviceId: '1', employeeId: '1', dateTime: new Date('2024-08-20T10:00:00'), status: AppointmentStatus.AGENDADO, taxiDog: false, paymentMethod: 'Pix', totalPrice: 40 },
  { id: 'a2', clientId: 'c2', petId: 'p2', serviceId: '3', employeeId: '1', dateTime: new Date('2024-08-20T11:00:00'), status: AppointmentStatus.CONFIRMADO, taxiDog: true, paymentMethod: 'Na Loja', totalPrice: 105 },
  { id: 'a3', clientId: 'c3', petId: 'p3', serviceId: '2', employeeId: '2', dateTime: new Date('2024-08-20T14:00:00'), status: AppointmentStatus.AGENDADO, taxiDog: false, paymentMethod: 'Pix', totalPrice: 25 },
];

const MOCK_EXPENSES: Expense[] = [
    {id: 'e1', description: 'Aluguel', amount: 1200, date: new Date('2024-08-05')},
    {id: 'e2', description: 'Compra de Shampoo', amount: 150, date: new Date('2024-08-10')},
    {id: 'e3', description: 'Energia Elétrica', amount: 250, date: new Date('2024-08-15')},
];


type OwnerPage = 'painel' | 'agendamentos' | 'servicos' | 'funcionarios' | 'financeiro' | 'configuracoes';

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<OwnerPage>('painel');

  const navItems: { id: OwnerPage; name: string; icon: React.ReactNode }[] = [
    { id: 'painel', name: 'Painel Geral', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'agendamentos', name: 'Agendamentos', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'servicos', name: 'Serviços e Preços', icon: <TagIcon className="w-5 h-5" /> },
    { id: 'funcionarios', name: 'Funcionários', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'financeiro', name: 'Financeiro', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg> },
    { id: 'configuracoes', name: 'Configurações', icon: <CogIcon className="w-5 h-5" /> },
  ];
  
  const PageContent = () => {
    switch (activePage) {
        case 'painel': return <DashboardPanel />;
        case 'agendamentos': return <AppointmentsManager />;
        case 'servicos': return <ServicesManager />;
        case 'funcionarios': return <EmployeesManager />;
        case 'financeiro': return <FinancialsManager />;
        case 'configuracoes': return <SettingsManager />;
      default: return <DashboardPanel />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-white p-6 border-r border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 text-sky-500">
            <PawIcon className="w-8 h-8"/>
            <span className="text-2xl font-bold">PetFlow</span>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map(item => (
                 <li key={item.id}>
                    <button onClick={() => setActivePage(item.id)} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activePage === item.id ? 'bg-sky-100 text-sky-600 font-semibold' : 'hover:bg-gray-100'}`}>
                        {item.icon} {item.name}
                    </button>
                </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-200">
             <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <ArrowLeftIcon className="w-5 h-5"/> Sair
              </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PageContent />
      </main>
    </div>
  );
};

// Sub-components for each page
const DashboardPanel: React.FC = () => {
    const { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } = (window as any).Recharts || {};

    const todayAppointments = MOCK_APPOINTMENTS_OWNER.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString());
    const totalRevenue = MOCK_APPOINTMENTS_OWNER.reduce((sum, app) => sum + app.totalPrice, 0);

    const data = [
      { name: 'Seg', Receita: 400 }, { name: 'Ter', Receita: 300 },
      { name: 'Qua', Receita: 200 }, { name: 'Qui', Receita: 278 },
      { name: 'Sex', Receita: 189 }, { name: 'Sáb', Receita: 239 },
      { name: 'Dom', Receita: 349 },
    ];
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel Geral</h1>
            <p className="text-gray-500 mt-1">Resumo do seu petshop.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-600">Agendamentos para Hoje</h3>
                    <p className="text-3xl font-bold mt-2">{todayAppointments.length}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-600">Receita do Mês</h3>
                    <p className="text-3xl font-bold mt-2">R$ {totalRevenue.toFixed(2)}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-600">Novos Clientes</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">Receita da Semana</h3>
                {LineChart ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="Receita" stroke="#4CB8E8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-gray-500">Carregando gráfico...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AppointmentsManager: React.FC = () => {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS_OWNER);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Agendamentos</h1>
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Pet</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map(app => {
                            const service = MOCK_SERVICES_OWNER.find(s => s.id === app.serviceId);
                            return (
                                <tr key={app.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">Cliente {app.clientId}</div>
                                        <div className="text-sm text-gray-500">Pet {app.petId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.dateTime).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{app.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                        <button className="text-red-600 hover:text-red-900 ml-4">Cancelar</button>
                                    </td>
                                </tr>
                            );
                        })}
                      </tbody>
                    </table>
                 </div>
            </div>
        </div>
    )
};

const ServicesManager: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Serviços e Preços</h1>
        <button className="mt-4 bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">Adicionar Serviço</button>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SERVICES_OWNER.map(service => (
                <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">{service.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    <div className="mt-4 space-y-1 text-sm">
                        <p>Pequeno: R$ {service.prices.Pequeno.toFixed(2)}</p>
                        <p>Médio: R$ {service.prices.Médio.toFixed(2)}</p>
                        <p>Grande: R$ {service.prices.Grande.toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const EmployeesManager: React.FC = () => (
     <div>
        <h1 className="text-3xl font-bold text-gray-800">Funcionários</h1>
        <button className="mt-4 bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">Adicionar Funcionário</button>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_EMPLOYEES_OWNER.map(emp => (
                <div key={emp.id} className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-gray-500"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{emp.name}</h3>
                        <p className="text-sm text-gray-600">{emp.position}</p>
                        <p className="text-xs text-gray-500">{emp.workingHours}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const FinancialsManager: React.FC = () => {
    const { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } = (window as any).Recharts || {};

    const revenue = useMemo(() => MOCK_APPOINTMENTS_OWNER.reduce((sum, a) => sum + a.totalPrice, 0), []);
    const expenses = useMemo(() => MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0), []);
    const netProfit = revenue - expenses;

    const reportData = [
        {name: 'Banho', 'Total Serviços': 40},
        {name: 'Tosa', 'Total Serviços': 30},
        {name: 'Banho & Tosa', 'Total Serviços': 50},
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Controle Financeiro</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="font-semibold text-gray-600">Receita Total</h3>
                    <p className="text-3xl font-bold mt-2 text-green-600">R$ {revenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                    <h3 className="font-semibold text-gray-600">Despesas Totais</h3>
                    <p className="text-3xl font-bold mt-2 text-red-600">R$ {expenses.toFixed(2)}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-600">Lucro Líquido</h3>
                    <p className="text-3xl font-bold mt-2 text-blue-600">R$ {netProfit.toFixed(2)}</p>
                </div>
            </div>
             <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4">Relatório de Serviços (Mês)</h3>
                {BarChart ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Total Serviços" fill="#FF914D" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                     <div className="flex items-center justify-center h-[300px]">
                        <p className="text-gray-500">Carregando gráfico...</p>
                    </div>
                )}
             </div>
        </div>
    );
};

const SettingsManager: React.FC = () => {
    const [taxiDogEnabled, setTaxiDogEnabled] = useState(true);
    const [taxiDogPrice, setTaxiDogPrice] = useState(15);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
            <div className="mt-6 space-y-8 max-w-2xl">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">Gerenciamento do Táxi Dog</h3>
                    <div className="mt-4 flex items-center justify-between">
                        <label htmlFor="taxi-toggle" className="font-medium">Ativar serviço de Táxi Dog</label>
                         <label htmlFor="taxi-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                {/* Fix: Replaced styled-jsx with Tailwind CSS peer classes for the toggle switch functionality. */}
                                <input type="checkbox" id="taxi-toggle" className="sr-only peer" checked={taxiDogEnabled} onChange={() => setTaxiDogEnabled(!taxiDogEnabled)} />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full peer-checked:bg-sky-500 transition"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-full"></div>
                            </div>
                        </label>
                    </div>
                    {taxiDogEnabled && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Preço por Viagem</label>
                            <input type="number" value={taxiDogPrice} onChange={e => setTaxiDogPrice(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"/>
                        </div>
                    )}
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">Assinatura</h3>
                    <p className="text-gray-600 mt-2">Você está no plano <span className="font-bold text-sky-600">Pro</span>.</p>
                     <button className="mt-4 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">Gerenciar Assinatura</button>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;