import React, {
    Suspense,
    lazy,
    useMemo,
} from 'react';
import { Spin } from 'antd'
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';


const ChatSide = lazy(()=>import('../ChatSide'));
const tabRouters = {
    chat:() => (
        <Suspense fallback={<Spin className="comSpin" />}>
            <ChatSide />
        </Suspense>
    )
}
const App = ():JSX.Element => {
    const renderRoutes = useMemo((): React.ReactNode => {
        const routes = [
            <Route path="/chat" render={tabRouters['chat']} key="/chat" />,
            <Redirect exact from="/" to="/chat" key="/"/>
        ] as React.ReactNode[]

        return routes;
    }, []);

    return  (
        <Router>
            <Switch>
                {renderRoutes}
            </Switch>
        </Router>
    )

}

export default App;
