module.exports = (matrix) => {

    let n = matrix.length;
    let m = matrix[0].length;
    
    let res = [];

    for(let i = 0; i < m; ++i)
    {
        let line = [];
        for(let j = 0; j < n; ++j)
        {
            line.push(matrix[j][i]);
        }

        res.push(line);
    }

    return res;
}