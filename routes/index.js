const router = require("express").Router();
const db = require('../models/');
const path = require("path");

// User App Routes
    // GET Index
router.get("/", (req, res) => {
    res.sendFile(path.join( __dirname, '../public/index.html'));
});
    // GET Exercise
router.get("/exercise", (req, res) => {
    res.sendFile(path.join( __dirname, '../public/exercise.html'));
});
    // GET Stats
router.get("/stats", (req, res) => {
    res.sendFile(path.join( __dirname, '../public/stats.html'));
});

// API Routes
    // GET Workouts
router.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([
        { $addFields: { totalDuration: { $sum: "$exercises.duration" }}}
    ])
        .sort({ date: 1 }) // oldest first
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});
    // GET Workouts In Range
router.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate([
        { $addFields: { totalDuration: { $sum: "$exercises.duration" }}}
    ])
        .sort({ date: -1 }) // newest first
        .then(dbWorkout => {
            dbWorkout = dbWorkout.slice(0,7); // slice, replace
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});
    // POST
router.post("/api/workouts", ({ body }, res) => {
    db.Workout.create(body)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});
    // PUT
router.put("/api/workouts/:id", (req, res) => {
    db.Workout.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { exercises: req.body }}
    )
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});


module.exports = router;
