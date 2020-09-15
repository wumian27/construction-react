import React from 'react';
import PropTypes from 'prop-types';
import './index.less';

// 将li接口渲染出来
// 将数据渲染出来

const MyTree = (props: any): JSX.Element => {
    const {
        onSelect = null, children = null, selectedItems = null, onOpenSelectDept = null,
    } = props;
    const handleSelct = (node): void => {
        if (onSelect) { onSelect(node); }
    };
    const handleOpenSelectDept = (node, show): void => {
        if (onOpenSelectDept) { onOpenSelectDept(node, show); }
    };

    return (
        <ul className="own-tree">
            {React.Children.map(children, (child: any) => React.cloneElement(child, {
                onSelect: handleSelct,
                onOpenSelectDept: handleOpenSelectDept,
                selectedItems,
            }))}
        </ul>
    );
};

export default MyTree;
