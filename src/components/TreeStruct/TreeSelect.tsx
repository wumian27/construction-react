import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Input, Spin } from 'antd';
import Tree from './Tree'; // ul
import TreeNode from './TreeNode'; // li
import './index.less';
// import Spin from '../../core/SpinSpot';
// import Empty from '../Empty';

const img = 'https://crm.staticec.com/mp/card/ec/company/20200603/377fcfd2-5a84-5c2b-b270-63eff5a9cf1e.jpg';

// TODO: 原始数据的格式化似乎要提到组件外面去
// console.log(TreeNode);

const TreeNodeFactory = React.createFactory(TreeNode);

// console.log(TreeNodeFactory,'fdfd')
// 增加到快捷搜索数组中
// const addToSearchArray = (searchArray, data): void => {
//     searchArray.push(data);
// };

// 创建树
const makeTree = (data, searchArray, props, depth = 0): any => {
    if (data === undefined || data.length < 0) return null;
    if (Array.isArray(data)) {
        return data.map((item) => makeTree(item, searchArray, props));
    }

    const newSubList = (data.childDataList || []).filter((item) => item.type <= props.use);// 过滤非目标节点
    // addToSearchArray(searchArray, data);
    if (data.type < props.use || newSubList.length > 0) { // 小根节点
        return TreeNodeFactory({
            id: data.qxDeptId,
            key: data.qxDeptId,
            title: data.name,
            type: data.type,
            data,
            vkey: data.qxDeptId,
            canNotSelect: !props.canSelectList,
            isDiscard: props.isDiscard,
            img,
            childShow: typeof props.showDepth === 'boolean'
                ? props.showDepth : (depth < props.showDepth),
            childShowList: props.showChildList.includes(data.qxDeptId),
        },
        // children 属性
        newSubList.map((item) => makeTree(item, searchArray, props, depth + 1)));
    } // 叶子节点
    return TreeNodeFactory({
        id: data.qxUserId,
        title: data.name,
        data,
        type: data.type,
        vkey: data.qxUserId,
        key: data.qxUserId,
        isDiscard: data.isDiscard,
        img: data.avatar,
        childShow: typeof props.showDepth === 'boolean'
            ? props.showDepth : (depth < props.showDepth),
        childShowList: props.showChildList.includes(data.qxDeptId),
    });
};

// 去掉节点子树
const formatData = (data): any => {
    if (!Array.isArray(data)) return data;

    return data.map((item) => {
        const tempArray = { ...item };
        delete tempArray.data;
        return tempArray;
    });
};

// 去重
const weedOut = (array): any => {
    const tempArray = [...array].reverse();
    const ob = {};
    const result = [] as any [];
    for (let i = 0, len = tempArray.length; i < len; i += 1) {
        const item = tempArray[i];
        if (ob[item.id] === undefined) {
            ob[item.id] = item.id;
            result.push(item);
        }
    }
    return [...result].reverse();
};

// let arrayViews;
const TreeSelect = (props: any): JSX.Element => {
    const {
        use = 0,
        canSelectList = true,
        showDepth = false,
        selectShowFunc = (node) => [node],
        afterSelect = (arr) => arr,
        onOk,
        onOpenSelectDept,
        data = [],
        checked,
    } = props;
    const [checkedArray, setCheckArray] = useState(checked);
    const [isSearchShow, setIsSearchShow] = useState(false);
    const [arrayViews, setArrayViews] = useState();
    // 初始化
    const init = (): void => {
        // const temdata = changeData(data, rule);
        if ((Array.isArray(data) && data.length > 0)) {
            const tempArrayViews = makeTree(data, [], props);
            // arrayViews = makeTree(data, [], props);
            setArrayViews(tempArrayViews);
        }
    };

    useEffect((): void => {
        init();
    }, [data]);

    // 选择节点
    const handleSelect = (node): void => {
        // const dataNode = selectShowFunc({ ...node.data });
        setCheckArray({ ...node.data });
        onOk({ ...node.data });
        // const newArray = afterSelect(checkedArray.concat(dataNode), dataNode);
        // const newCheckedArray = weedOut(formatData(newArray));

        // // 去重后不相等则更新
        // if (!isEqual(checkedArray, newCheckedArray)) {
        //     setCheckArray(newCheckedArray);
        //     onOk(newCheckedArray);
        // }
    };

    const hanlderOpenSelectDept = (node, show): void => {
        onOpenSelectDept({ ...node.data }, show);
    };
    return (
        <div className="own-tree-selector">
            <div className="own-tree-selector-content">
                <div className="own-list" style={{ display: isSearchShow ? 'none' : 'block' }}>
                    {
                        arrayViews === undefined
                            ? (
                                <Spin className="tree-spin" />
                            )
                            : (
                                <Tree onSelect={handleSelect} selectedItems={checkedArray} onOpenSelectDept={hanlderOpenSelectDept}>
                                    {arrayViews}
                                </Tree>
                            )
                    }

                    {/* <MyTree onSelect={handleSelect} selectedItems={checkedArray}>
                        {arrayViews}
                    </MyTree> */}

                </div>
            </div>
        </div>
    );
};

export default TreeSelect;
