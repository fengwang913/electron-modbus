import { lazy, ReactNode, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { PieChartOutlined, DesktopOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import LayoutPage from '../pages/Layout';
const Home = lazy(() => import('../pages/Home'));
const Download = lazy(() => import('../pages/Download'));
const Send = lazy(() => import('../pages/Send'));
const Setting = lazy(() => import('../pages/Setting'));

const lazyLoad = (children: ReactNode): ReactNode => {
  return (
    <Suspense fallback={<>loading...</>}>
      {children}
    </Suspense>
  )
}

interface RouterProps extends RouteObject {
  title?: string;
  icon?: React.ReactNode;
  children?: RouterProps[];
}

const router: RouterProps[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { path: '/search', title: '导入导出', element: lazyLoad(<Home />), icon: <PieChartOutlined /> },
      { path: '/download', title: '通信', element: lazyLoad(<Download />), icon: <DesktopOutlined /> },
      { path: '/send', title: '图表', element: lazyLoad(<Send />), icon: <SendOutlined /> },
      { path: '/setting', title: '设置', element: lazyLoad(<Setting />), icon: <SettingOutlined /> },
      { path: '/', element: <Navigate to='/search' replace /> }
    ]
  }
];

export default router;