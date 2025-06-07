import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {/* Logo 4× maior */}
              <img
                src="/LOGO-removebg.png"
                alt="DevVenture logo"
                className="w-32 h-32 object-contain"
              />
              <span className="text-white font-bold text-2xl">DevVenture</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Plataforma educacional desenvolvida pela equipe Harpion para conectar professores e alunos da ETEC Guaianazes em um ambiente digital inovador.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github size={24} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="/professor" className="text-sm hover:text-white transition-colors">Área do Professor</a>
              </li>
              <li>
                <a href="/aluno" className="text-sm hover:text-white transition-colors">Área do Aluno</a>
              </li>
              <li>
                <a href="/professor/login" className="text-sm hover:text-white transition-colors">Login Professor</a>
              </li>
              <li>
                <a href="/aluno/login" className="text-sm hover:text-white transition-colors">Login Aluno</a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-sm">harpion@etecguaianazes.sp.gov.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <span className="text-sm">(11) 2551-3547</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                <span className="text-sm">
                  Rua Feliciano de Mendonça, 290<br />
                  Guaianazes – São Paulo – SP<br />
                  CEP: 08460-365
                </span>
              </div>
            </div>
          </div>

          {/* Sobre a Equipe */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Equipe Harpion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Desenvolvido por estudantes de Desenvolvimento de Sistemas da ETEC Guaianazes como projeto de conclusão de curso.
            </p>
            <div className="space-y-2">
              <h4 className="text-white font-medium text-sm">Tecnologias:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">React</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">TypeScript</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">Tailwind</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha separadora */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © {currentYear} Equipe Harpion - ETEC Guaianazes. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
