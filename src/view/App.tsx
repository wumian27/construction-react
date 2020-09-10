import React from 'react';
import styles from './app.less';
import img from '../static/image_female.png';
import { Button } from 'antd';
const App = () => (
    <div className={styles.text}> 从零开始手写webpack搭建react项目 热更新gitgnore <span className={styles.text1}>red</span> <img src={img} alt=""/>
    <Button type="primary">按钮antd</Button>
    <span className="comm">555</span>
    
    </div>
)

export default App;
