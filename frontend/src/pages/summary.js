import React, { useState, useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import "../css/summary.css";
import axios from "axios";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
//import ChartDataLabels from 'chartjs-plugin-labels';


function Summary() {
    
    //Finance bar DOM container
    let live_barRef = useRef(null);
    let owe_barRef = useRef(null);
    let give_barRef = useRef(null);
    let grow_barRef = useRef(null);

    //Finance bar <h2> text container DOM refs
    let live_sumRef = useRef(null);
    let give_sumRef = useRef(null);
    let grow_sumRef = useRef(null);
    let owe_sumRef = useRef(null);

    //Variables for the summary finance bar values
    let [live_sum, setLiveSum] = useState(parseFloat(sessionStorage.getItem("liveTotal") || 0));
    let [give_sum, setGiveSum] = useState(parseFloat(sessionStorage.getItem("giveTotal") || 0));
    let [grow_sum, setGrowSum] = useState(parseFloat(sessionStorage.getItem("growTotal") || 0));
    let [owe_sum, setOweSum] = useState(parseFloat(sessionStorage.getItem("oweTotal") || 0));

    //Progress bar DOM Refs
    let circularProgressRef = useRef(null);
    let progressValueRef = useRef(null);
    let income_inputRef = useRef(null);
    let after_tax_divRef = useRef(null);
    let [afterTaxNum, setAfterTaxNum] = useState(parseFloat(sessionStorage.getItem("after_tax_num") || 0));
    let [incomeValue, setIncomeValue] = useState(parseFloat(sessionStorage.getItem("income_value")) || '');
    let [incomeExists, setIncomeExists] = useState(parseInt(sessionStorage.getItem("incomeExists") || 0));

    // Pie Chart viewport Ref
    const pieViewportRef = useRef(null);

    /** Links to other pages ***/
    useEffect(() => {
        live_barRef.current.addEventListener('click', () => {
            window.location.href = "/expenses#form-header";
        });

        give_barRef.current.addEventListener('click', () => {
            window.location.href = "/expenses#form-header";
        });

        grow_barRef.current.addEventListener('click', () => {
            window.location.href = "/expenses#form-header";
        });

        owe_barRef.current.addEventListener('click', () => {
            window.location.href = "/expenses#form-header";
        });
    }, [live_barRef, give_barRef, grow_barRef, owe_barRef]);



    /****Update Page Session Values on Refresh ****/
    let updateSession = () => {
        
        incomeInput();

        //Update Pie Chart
        //setExpenseTotal(live_sum + give_sum + grow_sum + owe_sum);
      };

      useEffect(() => {
        updateSession();
      }, []);

    let handleIncomeInputFocus = () => {
        income_inputRef.current.value = incomeValue;
      };



      let handleIncomeKeyPress = (event) => {
          
          if(event.charCode === 46) // check for decimal
          {
              if (event.target.value.indexOf('.') === -1) {                 
                  
              }else {
                  event.preventDefault();
              }
          }else if(event.charCode === 13) { //check for Enter
              event.preventDefault();
              event.currentTarget.blur(); // further calls the handleIncomeFocus() function --> updates income calculations
              
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

      let validateValue = (amnt) => {
        let regX = /[^0-9.]/g;
        amnt = String(amnt);

        if (amnt.trim().search(regX) !== -1){
          amnt = amnt.replace(regX, "");
          if (amnt.search(/\d+/g) === -1)//check for numbers
          {
            amnt = 0;
          }
        }
        return amnt;
      }

      let createMongoTotal = async (uid, incomeVal) => {
        try {
            //send post request to the 'api/users' endpoint
            const response = await axios.post('http://localhost:5000/api/summary', { 
                userID: uid,
                financeTotal: incomeVal,
                type: 'incomeTotal',
            });
            sessionStorage.setItem("income_value", incomeVal);


        } catch (error) {
            console.error(error);
        }

      } 

      let updateMongoTotal = async (uid, incomeVal, ty) => {
        try {
            //send post request to the 'api/users' endpoint
            const response = await axios.post('http://localhost:5000/api/updateSummary', { 
                userID: uid,
                financeTotal: incomeVal,
                type: ty,
            });
            sessionStorage.setItem("income_value", incomeVal);


        } catch (error) {
            console.error(error);
        }

      }

            
      let handleIncomeFocusOut = async () => { //Sets incomeValues. 
        
        incomeValue = validateValue(incomeValue);

        if(incomeValue !== '')
        {            
            if(incomeExists !== 0)
            {
                setIncomeValue(incomeValue);
                updateMongoTotal(sessionStorage.getItem('userID'), incomeValue, 'incomeTotal');

            }else{
                createMongoTotal(sessionStorage.getItem('userID'), incomeValue); //update Mongo database
                setIncomeExists(1);
                sessionStorage.setItem('incomeExists', 1);
            }           
              
            incomeInput();
            income_inputRef.current.value = '$' + parseFloat(incomeValue).toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2});
        }else{
        
          setIncomeValue('');
          sessionStorage.setItem("income_value", incomeValue);
          if(incomeExists !== 0)
            {
                setIncomeValue(incomeValue);
                updateMongoTotal(sessionStorage.getItem('userID'), 0, 'incomeTotal');

            }else{
                createMongoTotal(sessionStorage.getItem('userID'), 0); //update Mongo database
                setIncomeExists(1);
                sessionStorage.setItem('incomeExists', 1);
            }    
          incomeInput();
        }
      };

      let incomeInput = () => {
        let i_margin = incomeValue - (incomeValue * calcTax(incomeValue));
        setAfterTaxNum(i_margin);
        
        animateBar(i_margin, live_sum, give_sum, grow_sum, owe_sum);
        
      };

    //calculate tax off of the income value entered
    function calcTax(input_value = '') {
        /* Tax brackets is for single filers only in the US */
        let taxValue = 0;
        if (input_value > 0 && input_value <= 10275) {
            taxValue = 0.1;
        } else if (input_value > 10275 && input_value <= 41775) {
            taxValue = 0.12;
        } else if (input_value > 41775 && input_value <= 89075) {
            taxValue = 0.22;
        } else if (input_value > 89075 && input_value <= 170050) {
            taxValue = 0.24;
        } else if (input_value > 170050 && input_value <= 215950) {
            taxValue = 0.32;
        } else if (input_value > 215950 && input_value <= 539900) {
            taxValue = 0.35;
        } else if (input_value > 539900) {
            taxValue = 0.37;
        }

        return taxValue;
    }

          useEffect(() => {
            updateSession();
          }, []);
          
        function animateBar(i_margin, l_sum, g_sum, gr_sum, o_sum) {
                let progressValue = (progressValueRef || '').current;
                let circularProgress =  (circularProgressRef || '').current;
                let marginValue = i_margin - l_sum - g_sum - gr_sum - o_sum;
            
                //Handles font size if income number gets too large
                let fontSize = 40; 
                let tmp = marginValue.toFixed(2).toString().length;
                if (tmp < 6) {
                fontSize = 40;
                (progressValue || '').style.fontSize = fontSize + "px";
                } else if (tmp >= 6 && tmp < 8) {
                fontSize = 35;
                (progressValue || '').style.fontSize = fontSize + "px";
                } else if (tmp >= 8 && tmp < 10) {
                fontSize = 30;
                (progressValue || '').style.fontSize = fontSize + "px";
                } else if (tmp >= 10) {
                fontSize = 20;
                (progressValue || '').style.fontSize = fontSize + "px";
                }
            
                let progressStart = 0;
                let progressEnd = (marginValue / i_margin) * 100;
                let speed = 20;
            
                if (100 - progressEnd < 1 && 100 - progressEnd > 0) {
                progressEnd = 99;
                }
            
                let marginCount = marginValue - Math.trunc(progressEnd);
            
                if (marginValue <= 0) {
                progressStart = 0;
                progressValue.textContent = "$" + marginValue.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2});
                (circularProgress || '').style.background = `conic-gradient(darkgoldenrod ${progressStart * 3.6}deg, #ededed 0deg)`;
                } else {
                let progress = setInterval(() => {
                    progressStart++;
                    marginCount++;
            
                    if (marginCount >= marginValue) {
                    marginCount = marginValue;
                    }
                    progressValue.textContent = '$' + marginCount.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2});
                    (circularProgress || '').style.background = `conic-gradient(darkgoldenrod ${progressStart * 3.6}deg, #ededed 0deg)`; /*multiply by 3.6 as 1% of 360 = 3.6 --> dont change*/
            
                    if (progressStart >= progressEnd) {
                    clearInterval(progress);
                    }
                }, speed);
                }
            }

            
        let [chart, setChart] = useState(null);
        let [expenseTotal, setExpenseTotal] = useState(live_sum + give_sum + grow_sum + owe_sum);
        let chartSectionRef = useRef(null);
        let canvasRef = useRef(null);
        let chartErrorRef = useRef(null);
        let [chartDisplayed, setChartDisplayed] = useState(false);
    
            let displayChart = () => {

                let yValues = [live_sum, give_sum, grow_sum, owe_sum];
                let xValues = ["Live", "Give", "Grow", "Owe"];

                let barColors = [
                "#b026ff",
                "#00aba9",
                "#2b5797",
                "#009900"
                ];
                let hoverColors = [
                "#b026ff",
                "#00ccc9",
                "#3266b3",
                "#00cc00"
                ];

                let canvas = canvasRef.current;
                let chartError = chartErrorRef.current;

                let sum = yValues.reduce((a, b) => a + b, 0);

                if (sum === 0) {
                chartError.style.display = "block";
                canvas.style.display = "none";
                } else {
                chartError.style.display = "none";
                canvas.style.display = "block";

                let nonZeroIndexes = yValues.reduce((acc, val, idx) => {
                    if (val > 0) {
                    acc.push(idx);
                    }
                    return acc;
                }, []);

                let nonZeroLabels = nonZeroIndexes.map(idx => xValues[idx]);
                let nonZeroData = nonZeroIndexes.map(idx => yValues[idx]);
                let nonZeroColors = nonZeroIndexes.map(idx => barColors[idx]);
                let nonZeroHoverColors = nonZeroIndexes.map(idx => hoverColors[idx]);
                
                if (chart) {
                    chart.destroy();
                }

                chart = new Chart(canvas, {
                    type: "pie",
                    data: {
                    labels: nonZeroLabels,
                    datasets: [{
                        backgroundColor: nonZeroColors,
                        hoverBackgroundColor: nonZeroHoverColors,
                        data: nonZeroData,
                        datalabels: {
                        color: '#fff',
                        labels: null
                        },
                        animation: {
                        duration: 2000
                        }
                    }]
                    },
                    options: {
                        plugins: {
                            datalabels: {
                            color: '#fff',
                            font: {
                                size: 14
                            },
                            display: true,
                            formatter: function(data) {
                                let newData = data / expenseTotal * 100;
                                return newData.toFixed(1) + '%';
                            },
                            /*formatter: function(value, context) {
                                let percentage = ((value / expenseTotal) * 100).toFixed(1) + '%';
                                return percentage;
                              },*/
                             /* formatter: function(value, context) {
                                let percentage = ((value / sum) * 100).toFixed(1) + '%';
                                return percentage;
                              },*/
                            function (value, index, values) {
                                if (value > 0) {
                                value = value.toString();
                                value = value.split(/(?=(?:...)*$)/);
                                value = value.join(",");
                                return value;
                                } else {
                                value = "";
                                return value;
                                }
                            },
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] > 0; // only display labels for non-zero values
                              },
                        color: 'white'}
                            },
                        animation: {
                            
                            animateRotate: true,
                            animateScale: true,
                            //duration: 2000
                        }
                        }
                    }); 
    

                setChart(chart);
            }
        }

        let animateChart = () => {
            
            let canvas = (canvasRef || '').current;
            let chartError = (chartErrorRef || '').current;
            
            /*
            if (chartDisplayed === true ) {
                chartDisplayed = false;
                setChartDisplayed(chartDisplayed);
                canvas.style.opacity = 0;
                canvas.style.transition = "opacity 0.5s ease-in-out";
            } */
        
            if (chartDisplayed === false) {
                chartDisplayed = true;
                setChartDisplayed(chartDisplayed);
                canvas.style.opacity = 1;
                canvas.style.transition = "opacity 0.5s ease-in-out";
                displayChart();
            }
          
        }

        function useIsInViewPort(ref)
        {
            const [isIntersecting, setIsIntersecting] = useState(false);

            const observer = useMemo(
                () =>
                    new IntersectionObserver(([entry]) => 
                    setIsIntersecting(entry.isIntersecting),
                    ),
                [],
            );

            useEffect(() => {
                observer.observe(ref.current);

                return () => {
                    observer.disconnect();
                };

            }, [ref, observer]);

            
            return isIntersecting;
        }
        const isInViewPort = useIsInViewPort(chartSectionRef);

        useEffect(() => {
            if(isInViewPort === true)
            {
                animateChart();
                
            }else if (isInViewPort === false && chartDisplayed === true)
            {
                animateChart();
            }

        }, [isInViewPort])
                
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

            <section className='headersm'>
                <Navbar></Navbar>

                <div id="summary_head">
                    <h1>Income Summary</h1>
                </div>

                    <section className="progress-section" id="progress_bar">
                        <div className="progress-container">
                            <div className="circular-progress" ref={circularProgressRef}>
                                <span className="progress-value" id="progress_value" ref={progressValueRef}>$0</span>
                            </div>
                            <span className="income-text">Income Margin</span>

                            <input 
                            type="text" 
                            id="income_inputRef"
                            onChange={(event) => setIncomeValue(event.target.value)}
                            ref={income_inputRef} 
                            defaultValue={incomeValue !== '' ? "$" + parseFloat(incomeValue).toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2}) : incomeValue} 
                            onFocus={handleIncomeInputFocus} 
                            onKeyPress={handleIncomeKeyPress} 
                            onBlur={handleIncomeFocusOut} 
                            onPaste={validateValue}
                            autoComplete="false"
                            placeholder="Enter monthly income" 
                            /> 

                            <div id="after_tax" ref={after_tax_divRef}>
                                <h1 id="after_tax_h1">Income After Tax: <span id="after_tax_num" >${afterTaxNum.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</span></h1>
                            </div>
                            <div id="total_expenses">
                                <h1 id="total_expenses_h1">Total Expenses: <span id="total_expenses_num"> ${(live_sum + give_sum + grow_sum + owe_sum).toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</span></h1>
                            </div>
                        </div>
                    </section>

                    
                    <section className="finance-bar">
                        <div id="live_bar" className="shiny finance-num" ref={live_barRef}>
                            <h1>Live</h1>
                            <h2 ref={live_sumRef}>${live_sum.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</h2>
                        </div>
                    </section>

                    <section className="finance-bar">
                        <div id="give_bar" className="shiny finance-num" ref={give_barRef}>
                            <h1>Give</h1>
                            <h2 ref={give_sumRef}>${give_sum.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</h2>
                        </div>
                    </section>

                    <section className="finance-bar">
                        <div id="grow_bar" className="shiny finance-num" ref={grow_barRef}>
                            <h1>Grow</h1>
                            <h2 ref={grow_sumRef}>${grow_sum.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</h2>
                        </div>
                    </section>



                    <section className="finance-bar">
                        <div id="owe_bar" className="shiny finance-num" ref={owe_barRef}>
                            <h1>Owe</h1>    
                            <h2 ref={owe_sumRef}>${owe_sum.toLocaleString('en-US', {'minimumFractionDigits':2,'maximumFractionDigits':2})}</h2>    
                        </div>
                    </section>
                </section>
            
                <h1 className="pie-header1">Breakdown of Expenses</h1>
                <section className="alt-chart" id="chartSection" ref={chartSectionRef}>
                    <canvas style={{ width: '35%', maxWidth: '500px',height: '35%',maxHeight:'500px' }} ref={canvasRef} />
                    <div id="chartError" style= { {display: 'none'} } ref={chartErrorRef}>No data to display.</div>
                </section>
                
                <Footer></Footer>
        </>
    );
}

export default Summary