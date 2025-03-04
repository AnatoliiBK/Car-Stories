const Order = require("../models/order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

// GET ORDERS

router.get("/", isAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// UPDATE ORDER
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET AN ORDER
router.get("/findOne/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (req.user._id === order.userId || !req.user.isAdmin)
      return res
        .status(403)
        .json("Access To The Order Is Denied. Not Authorized");
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Перевірити, чи існує замовлення з даним id.
// Переконатися, що користувач, який робить запит, є або власником замовлення, або адміністратором.
// Повернути замовлення, якщо перевірки успішні.

// // GET AN ORDER
// router.get("/findOne/:id", auth, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json("Order Not Found");
//     }

//     if (req.user._id === order.userId || req.user.isAdmin) {
//       return res.status(200).json(order);
//     } else {
//       return res
//         .status(403)
//         .json("Access to the order is denied. Not authorized");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// GET ORDER STATS
router.get("/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");
  // res.json(previousMonth);
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(previousMonth) },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    console.log("STATS ORDERS : ", orders);
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// GET INCOME STATS

router.get("/income/stats", isAdmin, async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");
  // res.json(previousMonth);
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(previousMonth) },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    console.log("STATS ORDERS INCOME : ", income);
    res.status(200).json(income);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// GET 1 WEEK SALES

router.get("/week-sales", isAdmin, async (req, res) => {
  const last7Days = moment()
    .day(moment().day() - 7)
    .format("YYYY-MM-DD HH:mm:ss");
  // res.json(previousMonth);
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(last7Days) },
        },
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$sales" },
        },
      },
    ]);

    console.log("ORDERS WEEK SALES : ", income);
    res.status(200).json(income);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
module.exports = router;
