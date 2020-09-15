import React, { useEffect } from "react";
import styles from "./index.less";
import img from "../../static/image_female.png";
import { Button } from "antd";
import { getMock } from '../../services'
const ChatSide = () => {

    // 请求是写在modules里面 但没有配置 redux
    const fetchServe = async (): Promise<void> => {
        const data = await getMock();
        console.log(data, 'data数据');
    }
    useEffect((): void => {
        // fetchServe()

    }, []);
    return (
        <div className={styles.text}>
            {" "}
            从零开始手写webpack搭建react项目 热更新gitgnore
            <span className={styles.text1}>red</span>
            <img src={img} alt="" />
            <Button type="primary">按钮antd</Button>
            <span className="comm">555</span>
        </div>
    );
};

export default ChatSide;
