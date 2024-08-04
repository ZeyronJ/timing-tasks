import { openDatabase } from '../utils/database';
import { useEffect, useState } from 'react';

export const useConfig = () => {
  const [config, setConfig] = useState({});
  const db = openDatabase();

  useEffect(() => {
    const getConfig = async () => {
      try {
        const config = await db.getAsync('SELECT * FROM config WHERE id = 1');
        setConfig(config);
      } catch (error) {
        console.log(error);
      }
    };

    getConfig();
  }, []);

  return config;
};
