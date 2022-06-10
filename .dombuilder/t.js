function titleCase(str) {
  const temp = str.split(' ')
  .map(w=>`${w.slice(0,1).toUpperCase()}${w.slice(1).toLowerCase()}`)
  return temp.join(' ')
}



console.log('titleCase("Im a little tea pot")',titleCase("I'm a little tea pot"))