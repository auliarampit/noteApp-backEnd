'use strict'

const response = require('../helpers/status')
const conn = require('../config/db')

exports.getNotes = (req, res) => {
    let params = {
        page: parseInt(req.query.page) || 1,
        search: req.query.search || '',
        sort: req.query.sort || 'DESC',
        limit: parseInt(req.query.limit) || 10,
        category: req.query.category || '',
    }
    let conState = params.category == '' ? 'OR' : 'AND'
    let totalData
    let totalPage
    let offset = (params.page -1) * params.limit

    conn.query(
        `SELECT count(*) 'total' FROM notes INNER JOIN category ON category.id = notes.category where title LIKE 
        '%${params.search}%' ${conState} category.name = '${params.category}'`,
        (error, rows, field) => {
            totalData = rows[0].total
            totalPage = Math.ceil(Number(totalData) / params.limit)
        }
    )
    conn.query(
        `SELECT title, note, category.name 'category', DATE_FORMAT(time, '%d/%m/%Y %h:%i:%s') as 'datetime',
        category.id as 'idCategory', notes.id as 'noteId' FROM notes INNER JOIN category ON category.id = notes.category
        WHERE title LIKE '%${params.search}%' ${conState} category.name = '${params.category}' ORDER BY time ${params.sort}
        limit ${params.limit} offset ${offset}`,
        (error, rows, field) => {
            if (error) {
                throw error
            } else {
                if (rows.length == 0) {
                    response.pagination(totalData, params.page, totalPage, params.limit, rows, res, params.search, params.category)
                } else {
                    response.pagination(totalData, params.page, totalPage, params.limit, rows, res, params.search, params.category)
                }
            }
        }
    )
}

exports.getNotesById = function (req, res) {
    let id = req.params.id;

    conn.query(
        `SELECT title,note,category.name 'category',DATE_FORMAT(time, '%m/%d/%Y %H:%i:%s') as 'date time' FROM notes
          INNER JOIN category  ON category.id = notes.category where notes.id=? ORDER BY time desc`, [id],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
                if (rows.length != 0) {
                    return res.send({
                        data: rows,
                    })
                } else {
                    return res.send({
                        message: "no record found"
                    })
                }
            }
        }
    )
}

exports.addNote = function (req, res) {
    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;

    conn.query(
        `INSERT INTO notes SET title=?,note=?,category=?`, [title, note, category],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
                conn.query(`select title,note,category.name 'category', DATE_FORMAT(time, '%d/%m/%Y %h:%i:%s') as 'datetime',category.id as 'idCategory',notes.id as 'noteId' from notes inner join category  on category.id = notes.category order by time DESC limit 1`
                ,function(error,rows,field) {
                    if(error){
                        console.log(error)
                    }else{
                        return res.send({
                            data:rows
                        })
                    }
                })
            }
        }
    )
}

exports.patchNote = function (req, res) {

    let id = req.params.id;
    let title = req.body.title;
    let note = req.body.note;
    let category = req.body.category;
    conn.query(
        `UPDATE notes SET title=?,note=?,category=? WHERE id=?`, [title, note, category, id],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
            conn.query(`select title,note,category.name 'category', DATE_FORMAT(time, '%d/%m/%Y %h:%i:%s') as 'datetime',category.id as 'idCategory',notes.id as 'noteId' from notes inner join category  on category.id = notes.category WHERE notes.id=${id} order by time DESC limit 1`,
             function (error, rows, field) {
                if (error) {
                    console.log(error)
                } else {
                    return res.send({
                        data: rows
                    })
                }
            })
            }
        }
    )
}

exports.deleteNote = function (req, res) {
    let id = parseInt(req.params.id);

    conn.query(
        `DELETE FROM notes WHERE id=?;`, [id],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
                return res.send({
                    data:{
                        noteId:id
                    },
                    error: false,
                    rows: rows,
                    message: 'data deleted successfully!'
                })
            }
        }
    )
}

exports.addCategory = function (req, res) {
    let name = req.body.name;
    let imageURL = req.body.image

    conn.query(
        `INSERT INTO category SET name=?,image=?;`, [name,imageURL],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {

                return res.send({
                    data:{
                        id:rows.insertId,
                        name:name,
                        imageURL:imageURL
                    },
                    rows:rows,
                    message: "data created successfully!"
                })
            }
        }
    )
}


exports.patchCategory = function (req, res) {
    let id = req.params.id;
    let name = req.body.name;

    conn.query(
        `UPDATE category SET name=? WHERE id=?;`, [name, id],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
                return res.send({
                    message: "data updated successfully!"
                })
            }
        }
    )
}

exports.deleteCategory = function (req, res) {
    let id = parseInt(req.params.id);

    conn.query(
        `DELETE FROM category WHERE id=?;`, [id],
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
                return res.send({
                    id:id,
                    data:rows,
                    message: "data deleted successfully!"
                })
            }
        }
    )
}

exports.getCategory=function(req,res){
    conn.query(
        `SELECT * FROM category ;`,
        function (error, rows, field) {
            if (error) {
                throw error
            } else {
                return res.send({
                    data:rows
                })
            }
        }
    )
}
