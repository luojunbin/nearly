export default function infer(list, filter) {

    let completedNum = 0;
    let activeNum = 0;

    let selectedList = list.filter((todoItem) => {

        todoItem.isCompleted ? ++completedNum : ++activeNum;

        switch (filter.toUpperCase()) {
            case 'ACTIVE':
                return !todoItem.isCompleted;

            case 'COMPLETED':
                return todoItem.isCompleted;

            case 'ALL':
            default:
                return true;
        }

    });

    return {completedNum, activeNum, selectedList, filter}
}
