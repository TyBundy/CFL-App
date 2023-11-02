import React, { useState, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../css/shared_css/inputform.css";
import "../css/shared_css/table.css";
import "../css/shared_css/herobutton.css";
import "../css/expenses.css";
import axios from 'axios';

/*eslint-disable jsx-a11y/anchor-is-valid*/

function Expenses() {
    let [liveTotal, setLiveTotal] = useState(parseFloat(sessionStorage.getItem("liveTotal") || 0));
    let [giveTotal, setGiveTotal] = useState(parseFloat(sessionStorage.getItem("giveTotal") || 0));
    let [growTotal, setGrowTotal] = useState(parseFloat(sessionStorage.getItem("GrowTotal") || 0));
    let [oweTotal, setOweTotal] = useState(parseFloat(sessionStorage.getItem("OweTotal") || 0));

    let [liveExists, setLiveExists] = useState(parseInt(sessionStorage.getItem('liveExists') || 0));
    let [giveExists, setGiveExists] = useState(parseInt(sessionStorage.getItem('giveExists') || 0));
    let [growExists, setGrowExists] = useState(parseInt(sessionStorage.getItem('growExists') || 0));
    let [oweExists, setOweExists] = useState(parseInt(sessionStorage.getItem('oweExists') || 0));

    let [rows, setRows] = useState(JSON.parse(sessionStorage.getItem("expenseTableRows")) || []);
    console.log(rows)
    let [totalRows, setTotalRows] = useState(parseFloat(sessionStorage.getItem("totalRows")) || 0);
    const [isMobile] = useState(window.innerWidth <= 480);
    const descriptionHeader = isMobile ? "Desc." : "Description";
    const amntHeader = isMobile ? "Amnt." : "Amount";
    
    let amntRef = useRef(null);

        let createMongoRow = async (uid, category, description, date, amount, type) => 
        {
            try {

                const response = await axios.post('http://localhost:5000/api/expenseRow', { 
                    userID: uid,
                    category,
                    description,
                    date,
                    amount,
                    type
                });
                let _id = response.data._id;
                setRows([...rows, { category, description, date, amount, type, _id }]);
                sessionStorage.setItem("expenseTableRows", JSON.stringify([...rows, { category, description, date, amount, type, _id }]));
                
            } catch (error) {
                console.error(error);
            }
        }

        let createMongoTotal = async (uid, amnt, ty) => {

          try {
              //send post request to the 'api/users' endpoint
              const response = await axios.post('http://localhost:5000/api/summary', { 
                  userID: uid,
                  financeTotal: amnt,
                  type: ty,
              });
              console.log("Response = " + response.data);
  
          } catch (error) {
              console.error(error);
          }
      
      }
      let updateMongoSummary = async (uid, expenseVal, ty) => {
        try {
            //send post request to the 'api/users' endpoint
            const response = await axios.post('http://localhost:5000/api/updateSummary', { 
                userID: uid,
                financeTotal: expenseVal,
                type: ty,
            });    

        } catch (error) {
            console.error(error);
        }

      }

      let deleteMongoRow = async (uid, rID) => 
        {
            try {
                //send post request to the 'api/users' endpoint
                const response = await axios.post('http://localhost:5000/api/deleteExpenseRow', { 
                    userID: uid,
                    _id: rID,
                });
                console.log(response.data);
                await updateMongoSummary(sessionStorage.getItem('userID'), sessionStorage.getItem('expenseTotal'), 'expenseTotal');
            } catch (error) {
                console.error(error);
            }
        }

        let updateMongoTotal = async (uid, amnt, ty) => {
          try {
              //send post request to the 'api/users' endpoint
              const response = await axios.post('http://localhost:5000/api/updateSummary', { 
                  userID: uid,
                  financeTotal: amnt,
                  type: ty,
              });
              console.log("Response = " + response.data);
  
          } catch (error) {
              console.error(error);
          }
        }

        

        let validateValue = (amnt) => { 
          let regX = /[^0-9.]/g;

          if (amnt.trim().search(regX) !== -1){
            amnt = amnt.replace(regX, "");
            amntRef.current.value = amnt;
            if (amnt.search(/\d+/g) === -1)
            {
              amnt = 0;
            }
          }
          return amnt;
        }
    
        let onAddWebsite = async (e) => {
          e.preventDefault();
          let uid = sessionStorage.getItem('userID');
          let category = e.target.elements.Category.value; 
          let description = e.target.elements.Purchase.value;
          let date = e.target.elements.Date.value;
          let amount = parseFloat(validateValue(e.target.elements.Amount.value));
          let type = "";

          setTotalRows(totalRows + 1);
          sessionStorage.setItem('totalRows', totalRows);
          
          // Set the proper type corresponding to which category was picked
          if (category === "Food" || category === "Housing" || category === "Insurance" || category === "Transportation" || category === "Entertainment" || category === "Personal" || category === "Miscellaneous")
          {
            type = "Live";
          } 
          else if (category === "Tithing" || category === "Charity") 
          {
            type = "Give"
          }
          else if (category === "Emergency" || category === "Retirement") 
          {
            type = "Grow"
          }
          else if (category === "Student" || category === "Credit" || category === "Tax") 
          {
            type = "Owe"
          }

          if(amount !== 0)
            {        
              // If the type was in the Live category
              if (type === "Live") {
                  let amnt = parseFloat(liveTotal) + amount;
                  setLiveTotal(amnt);
                  sessionStorage.setItem("liveTotal", amnt);
                
                  createMongoRow(uid, category, description, date, amount, type);

                    if (liveExists !== 0)
                    {
                        updateMongoTotal(uid, amnt, 'liveTotal');
                    }else{
                        createMongoTotal(uid, amnt, 'liveTotal');
                        setLiveExists(1);
                        sessionStorage.setItem('liveExists', 1);
                    }
              }      
              // If the type was in the Give category
              else if (type === "Give") {
                  let amnt = parseFloat(giveTotal) + amount;
                  setGiveTotal(amnt);
                  sessionStorage.setItem("giveTotal", amnt);
                
                  createMongoRow(uid, category, description, date, amount, type);

                    if (giveExists !== 0)
                    {
                        updateMongoTotal(uid, amnt, 'giveTotal');
                    }else{
                        createMongoTotal(uid, amnt, 'giveTotal');
                        setGiveExists(1);
                        sessionStorage.setItem('giveExists', 1);
                    }
              }      
              // If the type was in the Grow category
              else if (type === "Grow") {
                  let amnt = parseFloat(growTotal) + amount;
                  setGrowTotal(amnt);
                  sessionStorage.setItem("growTotal", amnt);
                
                  createMongoRow(uid, category, description, date, amount, type);

                    if (growExists !== 0)
                    {
                        updateMongoTotal(uid, amnt, 'growTotal');
                    }else{
                        createMongoTotal(uid, amnt, 'growTotal');
                        setGrowExists(1);
                        sessionStorage.setItem('growExists', 1);
                    }
              }        
              // If the type was in the Owe category
              else if (type === "Owe") {
                  let amnt = parseFloat(oweTotal) + amount;
                  setOweTotal(amnt);
                  sessionStorage.setItem("oweTotal", amnt);
                
                  createMongoRow(uid, category, description, date, amount, type);

                    if (oweExists !== 0)
                    {
                        updateMongoTotal(uid, amnt, 'oweTotal');
                    }else{
                        createMongoTotal(uid, amnt, 'oweTotal');
                        setOweExists(1);
                        sessionStorage.setItem('oweExists', 1);
                    }
              }    
              else {
                console.log("Invalid type");
              }
          }
      
        };
    
        let onDeleteRow = (index) => {
            let rowToDelete = rows[index];
            console.log(index);
            let amntToDelete = rowToDelete.amount;
            let type = rowToDelete.type;
            let rID = rowToDelete._id;          

            // Deleting a Live row
            if (type === "Live") {
              setLiveTotal(parseFloat(liveTotal) - parseFloat(amntToDelete));
              sessionStorage.setItem("liveTotal", parseFloat(liveTotal) - parseFloat(amntToDelete));
          
              let updatedRows = rows.filter((_, i) => i !== index);
              setRows(updatedRows);
              sessionStorage.setItem("expenseTableRows", JSON.stringify(updatedRows));

              deleteMongoRow(sessionStorage.getItem('userID'), rID);
            }
            // Deleting a Give row
            else if (type === "Give") {
              setGiveTotal(parseFloat(giveTotal) - parseFloat(amntToDelete));
              sessionStorage.setItem("giveTotal", parseFloat(giveTotal) - parseFloat(amntToDelete));
          
              let updatedRows = rows.filter((_, i) => i !== index);
              setRows(updatedRows);
              sessionStorage.setItem("expenseTableRows", JSON.stringify(updatedRows));

              deleteMongoRow(sessionStorage.getItem('userID'), rID);
            }
            // Deleting a Grow row
            else if (type === "Grow") {
              setGrowTotal(parseFloat(growTotal) - parseFloat(amntToDelete));
              sessionStorage.setItem("growTotal", parseFloat(growTotal) - parseFloat(amntToDelete));
          
              let updatedRows = rows.filter((_, i) => i !== index);
              setRows(updatedRows);
              sessionStorage.setItem("expenseTableRows", JSON.stringify(updatedRows));

              deleteMongoRow(sessionStorage.getItem('userID'), rID);
            }
            // Deleting a Owe row
            else if (type === "Owe") {
              setOweTotal(parseFloat(oweTotal) - parseFloat(amntToDelete));
              sessionStorage.setItem("oweTotal", parseFloat(oweTotal) - parseFloat(amntToDelete));
          
              let updatedRows = rows.filter((_, i) => i !== index);
              setRows(updatedRows);
              sessionStorage.setItem("expenseTableRows", JSON.stringify(updatedRows));

              deleteMongoRow(sessionStorage.getItem('userID'), rID);
            }
        };

        let [category, setCategory] = useState('');

        let handleCategoryChange = (event) => {
            setCategory(event.target.value);
        };

        let handleIncomeKeyPress = (event) => {
          
            if(event.charCode === 46) // check for decimal
            {
                if (event.target.value.indexOf('.') === -1) {                 
                    
                }else {
                    event.preventDefault();
                }
            }else if(event.charCode === 13) { //check for Enter
                
                //allow submission of the form

            }else{ //check for number only input
                if (( event.charCode > 31) && 
                (event.charCode < 48 || event.charCode > 57)){
                  event.preventDefault();
                }
  
                let searchVal = event.target.value.search(/\./);
                if (searchVal !== -1 && event.target.selectionStart > searchVal && event.target.value.split('.')[1].length === 2) //check for only two decimals
                {
                  event.preventDefault();
                }
            }
            
        };

        let formatDate = (date) => {
          date = date.split('T')[0];
          return date;
        }

return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
      />

      <section className='headergv'>
        <Navbar></Navbar>

        <div className="text-box">
          <h1>Expenses</h1>
          <hr />
          <p>What are my expenses?</p>
          <a href="#form-header" className="hero-btn" id="libertyBtn"
          >Click here to enter your expenses</a>
        </div>
      </section>

        <section>
            <h1 id="form-header" className="form-header">Enter your Expenses</h1>
            <div className="containerL" id='containerL'>
                <form action="#" method="POST" onSubmit={onAddWebsite}>
                <div className="user-details">
                <div className="input-box">
                    <label htmlFor="categoryInput">Category</label>
                    <select
                    className="input-box"
                    name="Category"
                    id="categoryInput"
                    value={category}
                    onChange={handleCategoryChange}
                    required>
                      
                    <option value="">Select the category</option>
                    
                    <option value="">----------------------- Live ----------------------</option>
                    <option value="Food">Food</option>
                    <option value="Housing">Housing</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Personal">Personal Spending</option>

                    <option value="">---------------------- Give ---------------------</option>
                    <option value="Tithing">Tithing</option>
                    <option value="Charity">Charity</option>
                    
                    <option value="">---------------------- Grow --------------------</option>
                    <option value="Emergency">Emergency Fund</option>
                    <option value="Retirement">Retirement Savings</option>
                    
                    <option value="">---------------------- Owe ---------------------</option>
                    <option value="Student">Student Loans</option>
                    <option value="Credit">Credit Cards</option>
                    <option value="Tax">Taxes</option>

                    <option value="Miscellaneous">Miscellaneous</option>
                            
              </select>
            </div>
      
            <div className="input-box">
              <span className="details">Description</span>
              <input type="text" id="PurchaseInput" className="purchaseInput" placeholder="Enter the type of purchase"
                name="Purchase" required />
            </div>
      
            <div className="input-box">
              <span className="details">Date</span>
              <input type="date" id="DateInput" className="dateInput" placeholder="11/14/2022" name="Date" max="9999-12-31" required />
            </div>
      
            <div className="input-box">
              <span className="details">Amount</span>
              <input 
              type="text" 
              id="AmountInput" 
              className="amountInput" 
              data-type="currency"
              onKeyPress={handleIncomeKeyPress}
              placeholder="Enter the amount" 
              autoComplete="false"
              ref={amntRef}
              name="Amount" 
              required />
            </div>
          </div>
          <div className="button">
            <input type="submit" value="Submit" id="button" />
          </div>
        </form>
      </div>
    </section>

            <section>
                <table id="tbl" className="table">
                <thead>
                <tr>
                    <th id="type">Type</th>
                    <th>Category</th>
                    <th>{descriptionHeader}</th>
                    <th>Date</th>
                    <th>{amntHeader}</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                        <td id="type">{row.type}</td>
                        <td>{row.category}</td>
                        <td id="desp">{row.description}</td>
                        <td>{formatDate(row.date)}</td>
                        <td>{'$' + row.amount.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</td>
                        <td><button id="deleteBtn" onClick={() => onDeleteRow(index)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </section>

      <section className="summary-link">
        <a href="/summary" className="hero-btn gold-btn" id="LibertyBtn">
          Back to Summary
        </a>
      </section>

      <Footer></Footer>
    </>
  );
}

export default Expenses;