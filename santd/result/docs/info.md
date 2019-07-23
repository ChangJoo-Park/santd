<cn>
#### Info
展示处理结果。
</cn>

```html
<template>
    <div>
        <s-result
            title="Your operation has been executed"
            extra="{{extra}}"
        />
    </div>
</template>
<script>
import Result from 'santd/result';
import Button from 'santd/button';
import san from 'san';

export default {
    components: {
        's-result': Result
    },
    initData() {
        return {
            extra: san.defineComponent({
                components: {
                    's-button': Button
                },
                template: `<div>
                    <s-button type="primary" key="console">Go Console</s-button>
                </div>`
            })
        }
    }
}
</script>
```