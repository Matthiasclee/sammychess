// The code is just as goofy as the game :)

let characters = {}
let board_positions = {}
let squareselected = false
let selectedsquare = ""
let gun_activated = false
let turn = "white"
let black_horses_disabled = false
let white_horses_disabled = false

function get_element(c_id) {
  c = characters[c_id]["color"]
  l = characters[c_id]["type"][0]
  return `<b style="color: ${c}">${l}</b>`
}

function new_character(c, loc, color) {
  if (board_positions[loc]) {
    return "board position filled"
  }

  c_id = Math.random().toString()
  characters[c_id] = {"type": c, "loc": loc, "color": color}
  board_positions[loc] = c_id

  c_e =document.getElementById(loc) 
  c_e.innerHTML = get_element(c_id)

  return c_id
}

function move_character(c_id, loc) {
  c=characters[c_id]
  nl=board_positions[loc]
  if (!nl) {
    console.log("empty space")
  } else if (c["color"] == characters[nl]["color"]){
    alert("Cannot capture own piece")
    return("Cannot capture own piece")
  } else if ((c["type"] == "horse") && ((characters[board_positions[loc]]["type"] == "horse") || (characters[board_positions[loc]]["type"] == "king"))){
    alert("Horse cannot kill kings and other horses")
    return
  }

  prev_loc = characters[c_id]["loc"]
  board_positions[prev_loc] = undefined
  document.getElementById(prev_loc).innerHTML = ""

  characters[c_id]["loc"] = loc
  board_positions[loc] = c_id
  document.getElementById(loc).innerHTML = get_element(c_id)
  return(true)
}

function squareClicked(loc){
  if (squareselected) {
    if (gun_activated){
      if (!characters[board_positions[loc]]){
        alert("You can't shoot at nothing.")
        return
      }
      if ((characters[board_positions[loc]]["type"] == "horse") || (characters[board_positions[loc]]["type"] == "king")){
        alert("Horse cannot kill kings and other horses")
        return
      }
      document.getElementById(loc).innerHTML=""
      board_positions[loc] = undefined
      gun_activated = false
      hidegun()
      document.getElementById(selectedsquare).style.background = "lightblue"
      squareselected = false
      selectedsquare = ""
      next_turn()
      return
    }

    l = selectedsquare.replace("r", "").split("c")
    nl = loc.replace("r", "").split("c")
    c = characters[board_positions[selectedsquare]]
    console.log(c["type"])
    // Determine if move is possible
    if (c["type"] == "rook"){
      console.log(l)
      console.log(loc)
      if ((l[0] != nl[0]) && (l[1] != nl[1])){
        return false
      }
    } else if (c["type"] == "bishop") {
      a = parseInt(l[0])
      b = parseInt(l[1])
      aa = parseInt(nl[0])
      ab = parseInt(nl[1])
      if ((Math.abs(a-aa)) != Math.abs((b-ab))){
        return false
      }
    } else if ((c["type"] == "king") || (c["type"] == "pawn")){
      a = parseInt(l[0])
      b = parseInt(l[1])
      aa = parseInt(nl[0])
      ab = parseInt(nl[1])
      if (Math.abs(a-aa) > 1 || Math.abs(b-ab) > 1){
        return false
      }
    }

    // Promote pawn if applicable
    if (c["type"] == "pawn" && (((c["color"] == "black") && (nl[0] == "10")) || ((c["color"] == "white") && (nl[0] == "1")))){
      p_to = prompt("Promote to?")
      if (!(["king", "queen", "horse", "rook", "bishop"].includes(p_to))){
        p_to = "pawn"
      }
      characters[board_positions[selectedsquare]]["type"] = p_to
    }

    // Summon ***
    if (c["type"] == "king" && nl[1] == "5") {
      l_chr = characters[board_positions[`r${nl[0]}c4`]]
      r_chr = characters[board_positions[`r${nl[0]}c6`]]
      if (l_chr && r_chr){
        if ((l_chr["color"] == c["color"] && l_chr["type"] == "king") && (r_chr["color"] == c["color"] && r_chr["type"] == "king")){
          if (c["color"] == "black"){
            white_horses_disabled = true
            alert("White horses disabled")
          } else if (c["color"] == "white"){
            black_horses_disabled = true
            alert("Black horses disabled")
          }
        }  
      }

    }

    console.log("a")
    console.log(loc)
    document.getElementById(selectedsquare).style.background = "lightblue"
    c_id = board_positions[selectedsquare]
    console.log(c_id)
    move_character(c_id, loc)

    squareselected = false
    gun_activated = false
    hidegun()
    next_turn()
  } else {
    if (!board_positions[loc]){
      return
    }
    if (characters[board_positions[loc]]["color"] != turn){
      alert("Can't move that piece")
      return
    }
    if (characters[board_positions[loc]]["type"] == "horse"){
      if (turn == "black" && black_horses_disabled){
        alert("Black horses are disabled")
        return
      }
      if (turn == "white" && white_horses_disabled){
        alert("White horses are disabled")
        return
      }
    }
    document.getElementById(loc).style.background = "green"
    squareselected = true
    selectedsquare = loc

    if (characters[board_positions[loc]]["type"] == "horse"){showgun()}
  }
}

function usegun(){
  if (!squareselected) {
    return
  }
  gun_activated = true
}
function showgun(){
  document.getElementById("gun").style.display="block"
  document.getElementById("gunuse").style.display="block"
}
function hidegun(){
  document.getElementById("gun").style.display="none"
  document.getElementById("gunuse").style.display="none"
}
function next_turn(){
  if (turn == "white"){
    turn = "black"
  } else {
    turn = "white"
  }
}





// Set up board

white_col = 1

while (white_col != 11) {
  new_character("horse", `r8c${white_col}`, "white")
  new_character("pawn", `r9c${white_col}`, "white")

  white_col = white_col + 1
}

new_character("rook", `r10c1`, "white")
new_character("rook", `r10c10`, "white")

new_character("rook", `r10c2`, "white")
new_character("rook", `r10c9`, "white")

new_character("bishop", `r10c3`, "white")
new_character("bishop", `r10c8`, "white")

new_character("horse", `r10c4`, "white")
new_character("horse", `r10c7`, "white")

new_character("king", `r10c5`, "white")
new_character("queen", `r10c6`, "white")



black_col = 1

while (black_col != 11) {
  new_character("horse", `r3c${black_col}`, "black")
  new_character("pawn", `r2c${black_col}`, "black")

  black_col = black_col + 1
}

new_character("rook", `r1c1`, "black")
new_character("rook", `r1c10`, "black")

new_character("rook", `r1c2`, "black")
new_character("rook", `r1c9`, "black")

new_character("bishop", `r1c3`, "black")
new_character("bishop", `r1c8`, "black")

new_character("horse", `r1c4`, "black")
new_character("horse", `r1c7`, "black")

new_character("king", `r1c5`, "black")
new_character("queen", `r1c6`, "black")
