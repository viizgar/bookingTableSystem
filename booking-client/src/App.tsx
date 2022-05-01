import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import NotFound from './pages/NotFound/NotFound';
import FrontPage from './pages/FrontPage/FrontPage';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

    <div className="App">
      <Routes>
        <Route path="/" element={<NavigationMenu />}>
          <Route index element={<FrontPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
    </QueryClientProvider>

  );
}

export default App;
