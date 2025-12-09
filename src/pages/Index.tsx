import { DesktopProvider } from '@/contexts/DesktopContext';
import { Desktop } from '@/components/desktop/Desktop';
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Windows 11 Portfolio | Interactive Desktop Experience</title>
        <meta name="description" content="Experience a Windows 11 style interactive desktop portfolio with working apps, dark mode, and social media integration." />
      </Helmet>
      <DesktopProvider>
        <Desktop />
      </DesktopProvider>
    </>
  );
};

export default Index;
