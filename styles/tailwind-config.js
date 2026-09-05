    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#284CA5',
            'primary-hover': '#1f3f90',
            'primary-soft': '#DBE1FF',
            secondary: '#505F76',
            background: '#F1F5F9',
            'mobile-background': '#FAF8FF',
            surface: '#FFFFFF',
            'surface-low': '#F8FAFC',
            'surface-container': '#EEF2F7',
            'surface-container-lowest': '#FFFFFF',
            'outline-variant': '#C4C6D3',
            'on-surface': '#1A1B21',
            'on-surface-variant': '#444651',
            error: '#BA1A1A',
            'sidebar-blue': '#284CA5'
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Inter', 'sans-serif']
          },
          boxShadow: {
            card: '0 10px 25px rgba(15, 23, 42, 0.06)',
            soft: '0 4px 14px rgba(15, 23, 42, 0.07)'
          }
        }
      }
    };