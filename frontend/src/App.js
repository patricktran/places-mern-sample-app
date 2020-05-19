import React, { Suspense } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import MainNavigation from 'shared/components/navigation/main-navigation';
import { AuthContext } from 'shared/context/auth-context';
import { useAuth } from 'shared/hooks/auth-hook';
import LoadingSpinner from 'shared/components/ui-elements/loading-spinner';

//add support for code splitting
const Users = React.lazy(() => import('./user/pages/users'));
const NewPlace = React.lazy(() => import('./places/pages/new-place'));
const UserPlaces = React.lazy(() => import('./places/pages/user-places'));
const UpdatePlace = React.lazy(() => import('./places/pages/update-place'));
const Authenticate = React.lazy(() => import('./user/pages/authenticate'));

function App() {
  const { userId, token, login, logout } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>{' '}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        {/* Route order matters - since newplace and update route or similar, make sure new place appears first */}
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>{' '}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, login, logout, userId }}>
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
