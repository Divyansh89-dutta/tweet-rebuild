import User from '../models/user.js';
// req = request, res = response
export const followUser = async (req, res) => {
    const userId = req.user._id;
    const targetId = req.params.id;
    if( userId === targetId){
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId); // user do follow kar ga uski id aa jaya ga means id se check kare ga bo 0-1
    if(!targetUser) {
        return res.status(404).json({ message: 'Target user not found' });
    }
    if(user.following.includes(targetId))
        return res.status(400).json({ message: 'You are already following this user' });
    user.following.push(targetId);
    targetUser.followers.push(userId);
    res.status(200).json({ message: 'User followed'});
}

export const unfollowUser = async(req, res)=>{
    const userId = req.user._id;
    const targetId = req.params.id;
    
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);
    if(!targetUser) return res.status(404).json({ message: 'Target user not found' });
    user.following = user.following.filter((id) => id.toString()!== targetId);
    targetUser.followers = targetUser.followers.filter((id) => id.toString()!== userId);
    await user.save();
    await targetUser.save();
    res.status(200).json({ message: 'User unfollowed' });
}