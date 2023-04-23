// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';


import { Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <>
      <div role="navigation">
       
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
