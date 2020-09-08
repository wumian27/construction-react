import React from 'react';
import styles from './app.less';
import img from '../static/image_female.png'
const App = () => (
    <div className={styles.text}> 从零开始手写webpack搭建react项目 热更新gitgnore <span className={styles.text1}>red</span> <img src={img} alt=""/></div>
)

export default App;
