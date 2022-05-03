import './App.scss';
import { Route, Routes } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import NotFound from './pages/NotFound/NotFound';
import FrontPage from './pages/FrontPage/FrontPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import RestaurantAdmin from './pages/RestaurantAdmin/RestaurantAdmin';
import BookingSite from './pages/BookingSite/BookingSite';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

    <div className="App">
      <Routes>
        <Route path="/" element={<NavigationMenu />}>
          <Route index element={<FrontPage />} />
          <Route path="/admin/:id" element={<RestaurantAdmin />} />
        <Route path="/bookings/:id" element={<BookingSite />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
      </Routes>
    </div>
    </QueryClientProvider>

  );
}

export default App;
