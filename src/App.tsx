import { useContext } from 'react';
import styless from './App.module.scss';
import { AuthContext } from './components/contexts/auth';
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';

export function App() {

  const {user} = useContext(AuthContext);

  return (
    <main className={`${styless.contentWrapper} ${!!user? styless.contentSigned : ''}`}>
      <MessageList />
      { !!user ? <SendMessageForm /> : <LoginBox /> }
    </main>
  )
}
