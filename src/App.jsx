import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import MainLayout from './layout/MainLayout';
import { Fragment } from 'react';
import ProtectedRoute from './components/Ultilities/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => {
          const Page = route.page;
          const Layout = route.showHeader ? MainLayout : Fragment;

          // Conditionally wrap in ProtectedRoute only if `requiredScope` is present
          const Wrapper = route.requiredScope
            ? (props) => (
              <ProtectedRoute requiredScope={route.requiredScope}>
                {props.children}
              </ProtectedRoute>
            )
            : Fragment;

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Wrapper>
                  <Layout>
                    <Page />
                  </Layout>
                </Wrapper>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
