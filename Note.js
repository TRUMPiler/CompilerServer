const COLLECTION_NAME = 'Notes';
const mongodb=require('mongodb');
const noteModal = {
    Title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    language: { type: String, required: true },
    date:{type:Date,required:true,default:Date.now()},
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    
    addNote: async function (db,note) {
        try {
            db = db.collection(COLLECTION_NAME);
           const date = new Date();
           
note.date = date.toISOString().slice(0, 10);    
            const result = await db.insertOne(note);
            console.log(result);
            return result;

        } catch (error) {
            console.error('Error adding note:', error);
            throw error;
        }
    },
    updateNote: async function (db,note,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.updateOne({ _id:id }, { $set: note });
            return result;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    },
    deleteNote: async function (db,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.deleteOne({ _id:id });
            return result;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    },
    PinnedNote: async function (db,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.updateOne({ _id: id }, { $set: { isPinned: true } });
            return result;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    },
    getNote: async function (db,id) {
        try {
            db = db.collection(COLLECTION_NAME);
            const result = await db.findOne({ _id: id });
            return result;
        } catch (error) {
            console.error('Error getting note:', error);
            throw error;
        }
    },
    getAllNotes: async function (db,userId) {
        try {
               
            db = db.collection(COLLECTION_NAME);
            const result = await db.find({ "userId": userId }).toArray();
            return result;
        } catch (error) {
            console.error('Error getting all notes:', error);
            throw error;
        }
    }
};


module.exports = { noteModal, COLLECTION_NAME };