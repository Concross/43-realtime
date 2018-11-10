export default fn => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) reject(err)
      resolve(data)
    });
  });
}