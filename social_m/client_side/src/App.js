import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import Home from './routes/home';
import Login from './routes/login';
import Register from './routes/register';
import PageMenu from './components/menu';
import PostPage from './routes/PostPage';

import { AuthProvider } from './context/authentification';
import AuthRoute from './utility/AuthRoute';

function App() {
  return (
  // every route will have access to the context data
  <AuthProvider>
    <BrowserRouter>
    <Container>
      <PageMenu/>
      <Route path='/home' component={Home}/>
      <AuthRoute path='/login' component={Login}/>
      <AuthRoute path='/register' component={Register}/>  
      <Route path='/posts/:postID' component={PostPage}/>
    </Container>
  </BrowserRouter>
  </AuthProvider>
  );
}

export default App;
