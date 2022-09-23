import { useState } from 'react'
import { useRoutes } from "react-router-dom";
import router from "./router";
import styles from 'styles/app.module.scss'

const App: React.FC = () => {

  const element = useRoutes(router);

  return (
    <div className={styles.app}>
      {element}
    </div>
  )
}

export default App
