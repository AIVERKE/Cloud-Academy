import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          background: '#F5F5F5',
          surface: '#FFFFFF',
          success: '#4CAF50',
          warning: '#FB8C00', // orange/yellow
          error: '#FF5252',
          info: '#2196F3',
        },
      },
    },
  },
});
