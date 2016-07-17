import {connect, dispatcher} from 'nearly';

// 事件方法能缓存的尽量缓存
let incr = dispatcher('counter::increment');
let decr = dispatcher('counter::decrement');

// 更推荐使用 stateless component, 除非需要生命周期方法
function Counter(props) {

    let btns = [];

    for (let i = 0; i < 10; ++i) {
        btns.push(
            <a href="javascript:;"
               onClick={dispatcher('counter::update', i)}>
               {i}
            </a>
        )
    }

    return (
        <div>
            <p>{props.count}</p>
            <a href="javascript:;" onClick={incr}>-</a>
            {btns}
            <a href="javascript:;" onClick={decr}>+</a>
        </div>    
    )

}

export default connect(Counter, 'counter');

