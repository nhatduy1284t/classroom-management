import Enrollment from '../models/Enrollment.js'

var enrollController = {};

enrollController.enroll = async (req, res) => {
    try {
        const enroll = new Enrollment(req.body);

        const result = await enroll.save();
        res.json(result);
    } catch (error) {
        console.log(error)
    }
}

export default enrollController
