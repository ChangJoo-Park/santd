/**
* @file textarea组件
* @author fuqiangqiang@baidu.com
*/

import san, {DataTypes} from 'san';
import {classCreator} from '../core/util';
import keyCode from '../core/util/keyCode';
import calculateNodeHeight from './calculateNodeHeight';
const prefixCls = classCreator('input')();

export default san.defineComponent({
    dataTypes: {
        defaultValue: DataTypes.string,
        value: DataTypes.string
    },
    computed: {
        areaClass() {
            const disabled = this.data.get('disabled') || false;
            let classArr = [prefixCls];

            disabled && classArr.push(`${prefixCls}-disabled`);
            return classArr;
        }
    },
    initData() {
        return {
            sizeMap: {
                large: 'lg',
                small: 'sm'
            }
        };
    },
    attached() {
        this.getBaseData();
    },
    updated() {
        this.getBaseData();
    },
    getBaseData() {
        this.resizeTextarea();
    },
    resizeTextarea() {
        let autosize = this.data.get('autosize');
        let textareaStyles;
        if (!autosize) {
            return;
        }
        // 如果autosize里面传的是字符串对象，需要进行解析
        if (autosize.toString() === 'false' || autosize.toString() === 'true') {
            textareaStyles = calculateNodeHeight(this.el, false, null, null);
        }
        else {
            const parseObj = this.parseObjString(autosize);
            if (typeof parseObj === 'object') {
                const minRows = parseObj.minRows;
                const maxRows = parseObj.maxRows;
                textareaStyles = calculateNodeHeight(this.el, false, minRows, maxRows);
            }
        }
        this.data.set('styles', textareaStyles);
    },
    parseObjString(str) {
        str = str.replace(/'/g, '');
        const regExp = /{(.*)}/;
        let res = regExp.exec(str)[1].split(',');
        if (!res) {
            return '';
        }
        let obj = {};
        res.forEach(item => {
            let temp = item.split(':');
            obj[temp[0].trim()] = temp[1].toString().trim();
        });
        return obj;
    },
    handleKeyDown(e) {
        if (e.keyCode === keyCode.ENTER) {
            this.fire('pressEnter', e.target.value);
        }
    },
    handleTextareaChange(e) {
        this.nextTick(() => {
            this.resizeTextarea();
        });
        this.fire('inputChange', e.target.value);
        this.dispatch('UI:form-item-interact', {fieldValue: e.target.value, type: 'change'});
    },
    handleBlur(e) {
        this.fire('textareaBlur', e.target.value);
        this.dispatch('UI:form-item-interact', {fieldValue: e.target.value, type: 'change'});
    },
    template: `
        <textarea
            class="{{areaClass}}"
            style="{{styles}}"
            cols="{{cols}}"
            rows="{{rows}}"
            disabled="{{disabled}}"
            maxlength="{{maxlength}}"
            name="{{name}}"
            readonly="{{readOnly}}"
            autofocus="{{autofocus}}"
            placeholder="{{placeholder}}"
            on-input="handleTextareaChange($event)"
            on-keydown="handleKeyDown($event)"
            on-blur="handleBlur($event)"
            value="{{value || defaultValue}}"
        ></textarea>
    `
});