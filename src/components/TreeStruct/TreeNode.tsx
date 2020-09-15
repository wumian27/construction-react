import React, { useState } from 'react';
// import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import departIcon from '../../static/image_depart_file.png';
import './index.less';

const TreeNode = (props: any): JSX.Element => {
    const {
        childShow = false,
        canNotSelect = false,
        onSelect = null,
        onOpenSelectDept = null,
        selectedItems = {},
        id = '',
        vkey = '',
        children = null,
        title = '',
        type = 0,
        isDiscard = 0,
        img = '',
        childShowList = false,
    } = props;
    const [isChildeShow, setIsChildeShow] = useState((childShow || childShowList));

    const onselect = (e): any => {
        e.stopPropagation();
        if (canNotSelect) return;
        onSelect(props);
    };

    const handleClick = (e): void => {
        e.stopPropagation();
        setIsChildeShow(!isChildeShow);
        onOpenSelectDept(props, !isChildeShow);
    };

    const isThisNodeSelected = (): boolean => selectedItems.qxUserId === id;

    const RenderItem = (): JSX.Element => {
        const isSelected = isThisNodeSelected();
        let view;
        // console.log(isSelected,'ggfgf');

        if (Array.isArray(children)) {
            view = (
                <li key={vkey} onClick={onselect}>
                    <span className={`own-tree-title ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
                        {/* {
                            isChildeShow
                                ? (
                                    <CaretDownOutlined
                                        className="icon-caret"
                                        type="caret-down"
                                        // onClick={handleClick}
                                    />
                                )
                                : (
                                    <CaretUpOutlined
                                        className="icon-caret"
                                        type="caret-right"
                                        // onClick={handleClick}
                                    />
                                )
                        } */}
                        {/* <i className="own-icon icon-v-organizational-department" /> */}
                        <img src={departIcon} alt="" className="departIcon" />
                        <span className="own-tree-text">
                            {title}
                            {/* <span className="chat-number">
                                {
                                    children.length ? `(${children.length})` : ''
                                }

                            </span> */}
                        </span>

                    </span>
                    {!isChildeShow ? null : (
                        <ul style={{ paddingLeft: 15 }}>
                            {
                                React.Children.map(children, (child) => React.cloneElement(child, {
                                    onSelect,
                                    selectedItems,
                                    onOpenSelectDept,
                                }))
                            }
                        </ul>
                    )}
                </li>
            );
        } else {
            view = (
                <li key={vkey} onClick={onselect}>
                    <span className={`own-tree-node ${isSelected ? 'selected' : ''}`}>
                        {/* {
                            type === 2
                                ? <img src={departIcon} alt="" />
                                // ? <i className="own-icon icon-v-organizational-department" />
                                : null
                        } */}
                        {
                            type === 3
                                ? (
                                    // <i className={`own-icon icon-operator-platform ${
                                    //     isDiscard ? 'discard' : ''
                                    // }`}
                                    // />
                                    <img src={img} alt="" className="imgWith" />
                                )
                                : null
                        }
                        <span className="own-tree-text">{title}</span>
                    </span>
                </li>
            );
        }
        return view;
    };

    return (
        <div>{RenderItem()}</div>
    );
};

export default TreeNode;
