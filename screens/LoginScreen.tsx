import React, { useState } from 'react';
import { UserRole } from '../types';
import { DogIcon, StoreIcon, PawIcon, ArrowLeftIcon } from '../components/icons';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const PetFlowLogo: React.FC = () => (
    <div className="flex items-center justify-center gap-3 text-gray-700">
        <div className="p-2 bg-sky-400 rounded-full">
            <PawIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">PetFlow</h1>
    </div>
);

const LoginForm: React.FC<{ role: UserRole; onLogin: (role: UserRole) => void; onBack: () => void; }> = ({ role, onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd validate credentials here.
        onLogin(role);
    };

    const isClient = role === UserRole.CLIENT;

    // Define classes based on the role
    const focusRingClass = isClient ? 'focus:ring-orange-500 focus:border-orange-500' : 'focus:ring-sky-500 focus:border-sky-500';
    const textAccentClass = isClient ? 'text-orange-600 hover:text-orange-500' : 'text-sky-600 hover:text-sky-500';
    const checkboxClass = isClient ? 'text-orange-600 focus:ring-orange-500' : 'text-sky-600 focus:ring-sky-500';
    const buttonClass = isClient ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500' : 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-500';

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg transition-all duration-300">
            <div className="relative text-center">
                 <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    Login de {isClient ? 'Cliente' : 'Dono de Petshop'}
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm ${focusRingClass}`}
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="sr-only">Senha</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                             className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm ${focusRingClass}`}
                            placeholder="Sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className={`h-4 w-4 border-gray-300 rounded ${checkboxClass}`} />
                        <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                            Lembrar-me
                        </label>
                    </div>

                    <div >
                        <a href="#" className={`font-medium ${textAccentClass}`}>
                            Esqueceu sua senha?
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonClass}`}
                    >
                        Entrar
                    </button>
                </div>
                 <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Não tem uma conta?{' '}
                        <a href="#" className={`font-medium ${textAccentClass}`}>
                            Cadastre-se
                        </a>
                    </p>
                </div>
            </form>
        </div>
    )
}


const RoleSelection: React.FC<{ onSelect: (role: UserRole) => void; }> = ({ onSelect }) => (
     <div className="text-center w-full">
        <h2 className="text-2xl font-semibold text-gray-800">Como você quer acessar?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
          <div
            className="group cursor-pointer p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-orange-400"
            onClick={() => onSelect(UserRole.CLIENT)}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-orange-100 rounded-full">
                <DogIcon className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-800">Sou Cliente</h3>
              <p className="mt-2 text-gray-500">Agende serviços para o seu pet de forma rápida e fácil.</p>
            </div>
          </div>

          <div
            className="group cursor-pointer p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-sky-400"
            onClick={() => onSelect(UserRole.OWNER)}
          >
            <div className="flex flex-col items-center">
               <div className="p-4 bg-sky-100 rounded-full">
                <StoreIcon className="w-16 h-16 text-sky-500" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-800">Sou Dono de Petshop</h3>
              <p className="mt-2 text-gray-500">Gerencie sua agenda, equipe e finanças em um só lugar.</p>
            </div>
          </div>
        </div>
      </div>
);


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="text-center max-w-2xl mx-auto">
                <PetFlowLogo />
                {!selectedRole && (
                    <p className="mt-4 text-lg text-gray-600">
                        Organize seu petshop, encante seus clientes e ganhe tempo pra cuidar do que importa: os pets.
                    </p>
                )}
            </div>

            <div className="mt-12 w-full flex justify-center">
                {selectedRole ? (
                    <LoginForm 
                        role={selectedRole}
                        onLogin={onLogin}
                        onBack={() => setSelectedRole(null)}
                    />
                ) : (
                    <RoleSelection onSelect={setSelectedRole} />
                )}
            </div>
        </div>
    );
};

export default LoginScreen;