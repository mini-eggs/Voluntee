import * as _ from 'lodash'

const ObjToArr = props => Object.entries(props.obj)
export {ObjToArr}

const fixArrWithKey = props => props.arr.map(arr => {
  let newArr = arr[1]
  if(props.name) {
    newArr[props.name] = arr[0]
  }
  else {
    newArr.commentKey = arr[0]
  }
  return newArr
})
export {fixArrWithKey}

const orderArrBy = props => _.sortBy(props.arr, props.key)
export {orderArrBy}

const descDateFixArr = props => {
  if(!props.descDate) {
    return props.arr
  }
  else {
    let data = []
    props.arr.forEach(item => {
      if(item.descDate > props.descDate) {
        data.push(item)
      }
    })
    return data
  }
}
export {descDateFixArr}

const fixArrBySize = props => props.arr.slice(0, props.size)
export {fixArrBySize}

const takeOutProps = props => {
  let data = []
  props.arr.forEach(item => {
    if(!props.remove.includes(item[props.prop])) {
      data.push(item)
    }
  })
  return data
}
export {takeOutProps}

const error = props => {
  if(__DEV__) {
    console.log(`Error in ${props.function} withing ${props.file} Error below:`)
    console.log(props.error)
  }
  return props.error
}
export {error}
