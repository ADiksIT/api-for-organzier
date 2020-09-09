const { Router } = require('express');
const Todo = require('../../models/Todo');
const { mMonthSlice } = require('../../utils/allUtils');
const router = new Router();

router.get('/all/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const candidate = await Todo.findById(id);
		console.log(candidate);
		if (!candidate) {
			return res
				.status(500)
				.json({ message: 'candidate is not defined', candidate });
		}

		res.status(200).json(candidate);
	} catch (e) {
		res.status(500).json({ message: 'error' });
	}
});

router.get('/months/:month/id/:id', async (req, res) => {
	try {
		const { id, month } = req.params;
		const candidate = await Todo.findById(id);
		if (!candidate) {
			return res
				.status(500)
				.json({ message: 'candidate is not defined', candidate });
		}
		const result = candidate[new Date().getFullYear().toString()].filter(
			(item) => mMonthSlice(item.date) === month
		);
		console.log(result);
		if (!result.length) {
			return res.status(200).json({ message: 'not todo' });
		}

		res.status(200).json(result);
	} catch (e) {
		res.status(500).json({ message: 'error' });
	}
});

module.exports = router;
