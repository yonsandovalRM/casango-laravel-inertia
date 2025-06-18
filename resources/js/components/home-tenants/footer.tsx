// Esta data vendría de tu API/base de datos según el subdominio
const companyData = {
    name: 'Clínica Dental Sonrisas',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=50&h=50&fit=crop&crop=center',
    description: 'Tu salud dental es nuestra prioridad. Contamos con los mejores especialistas y tecnología de vanguardia.',
    branches: [
        {
            name: 'Sucursal Centro',
            address: 'Av. Principal 123, Centro',
            phone: '+1 234-567-8900',
            email: 'centro@clinicasonrisas.com',
        },
        {
            name: 'Sucursal Norte',
            address: 'Calle Norte 456, Zona Norte',
            phone: '+1 234-567-8901',
            email: 'norte@clinicasonrisas.com',
        },
    ],
    socialMedia: {
        facebook: 'https://facebook.com/clinicasonrisas',
        instagram: 'https://instagram.com/clinicasonrisas',
        whatsapp: '+1234567890',
    },
};

const Footer = () => {
    return (
        <footer className="border-t border-gray-800 bg-gray-900 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Company Info */}
                    <div>
                        <div className="mb-4 flex items-center">
                            <img src={companyData.logo} alt={`${companyData.name} Logo`} className="h-10 w-10 rounded-lg" />
                            <span className="ml-3 text-xl font-bold text-white">{companyData.name}</span>
                        </div>
                        <p className="mb-4 text-gray-400">{companyData.description}</p>
                        <div className="flex space-x-4">
                            <a href={companyData.socialMedia.facebook} className="text-gray-400 transition-colors hover:text-white">
                                Facebook
                            </a>
                            <a href={companyData.socialMedia.instagram} className="text-gray-400 transition-colors hover:text-white">
                                Instagram
                            </a>
                            <a
                                href={`https://wa.me/${companyData.socialMedia.whatsapp}`}
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Branches */}
                    <div className="md:col-span-2">
                        <h3 className="mb-4 font-semibold text-white">Nuestras Sucursales</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {companyData.branches.map((branch, index) => (
                                <div key={index} className="space-y-2">
                                    <h4 className="font-medium text-white">{branch.name}</h4>
                                    <p className="text-sm text-gray-400">{branch.address}</p>
                                    <p className="text-sm text-gray-400">{branch.phone}</p>
                                    <p className="text-sm text-gray-400">{branch.email}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-400">© 2024 {companyData.name}. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
