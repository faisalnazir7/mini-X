import { Home, UserCheck, User, Users2 , LogOut} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/x-logo.png'

export default function Nav() {
  const location = useLocation();
  const navigator = useNavigate();

  const exceptions=['/login','/register']

  const logoutUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (data.message) {
        localStorage.clear();
        document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigator('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (exceptions.includes(location.pathname)) {
    return null;
  }

  return (
    <aside className="fixed flex h-[100%] w-64 flex-col overflow-y-auto border-r px-5 py-8">
        
      <div className="mt-6 flex flex-1 flex-col justify-between items-center">
      <div className='flex h-32 w-32'>
        <img src={logo} alt='logo' />
        </div>
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 mt-10">
            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700"
              to="/"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-lg font-medium">Home</span>
            </Link>
            <Link
              to="/following"
              className="flex transform items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            >
              <UserCheck className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-lg font-medium">My Following</span>
            </Link>
            <Link
              to="/followers"
              className="flex transform items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            >
              <Users2 className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-lg font-medium">Followers</span>
            </Link>
            <Link
              className="flex transform items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              to="/profile"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-lg font-medium">Profile</span>
            </Link>
            <button
              className="flex transform items-center rounded-lg px-3 py-2 text-black transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => {
                if (window.confirm('Would you like to logout?')) {
                  logoutUser();
                }
              }}
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-lg font-medium">Logout</span>
            </button>
          </div>

          <div className="space-y-3 ">
            <button
              className="flex items-center px-12 py-2 bg-sky-500 hover:bg-sky-700 text-white font-bold text-xl rounded-full"
              onClick={() => navigator('/')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8.5 2h2.5L11 2h-2.5zM13 2h2.5L15.5 2h-2.5zM10.5 2h5v0h-5zM8.5 2h5v0h-5zM10 2h3.5L13.5 2h-3.5z"><animate fill="freeze" attributeName="d" dur="0.8s" keyTimes="0;0.3;0.5;1" values="M8.5 2h2.5L11 2h-2.5zM13 2h2.5L15.5 2h-2.5zM10.5 2h5v0h-5zM8.5 2h5v0h-5zM10 2h3.5L13.5 2h-3.5z;M8.5 2h2.5L11 22h-2.5zM13 2h2.5L15.5 22h-2.5zM10.5 2h5v2h-5zM8.5 20h5v2h-5zM10 2h3.5L13.5 22h-3.5z;M8.5 2h2.5L11 22h-2.5zM13 2h2.5L15.5 22h-2.5zM10.5 2h5v2h-5zM8.5 20h5v2h-5zM10 2h3.5L13.5 22h-3.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5zM3 2h5v2h-5zM16 20h5v2h-5zM18.5 2h3.5L5 22h-3.5z"/></path></svg>
              <span className="ml-2">Tweet</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
